# DATABASE SCHEMA - Pairings Project

**Last Updated:** October 22, 2025  
**Database Type:** PostgreSQL  
**ORM:** To be determined (Prisma recommended)

---

## Overview

This document defines the complete database schema for the Pairings Project. The schema is designed to support:
- Multiple game systems (modular approach)
- User authentication and profiles
- Tournament management with flexible formats
- Swiss pairing with comprehensive tracking
- Historical statistics and analytics
- Admin oversight and moderation

---

## Schema Diagram

```
users ──┬──→ tournament_organizers (role)
        ├──→ tournament_entries
        ├──→ player_statistics
        └──→ tournaments (as organizer)

tournaments ──┬──→ tournament_entries
              ├──→ rounds
              └──→ tournament_settings

rounds ──→ matches ──→ match_details

game_systems ──┬──→ formats
               ├──→ tournaments
               └──→ player_statistics

Module-Specific Tables:
warmachine_scenarios
warmachine_armies
warmachine_match_details
```

---

## Core Tables

### users

Stores all user accounts (players, organizers, admins).

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL, -- If using Supabase, handled externally
    avatar_url TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'player', -- 'player', 'organizer', 'admin'
    location VARCHAR(255), -- City, State, Country
    bio TEXT,
    
    -- Privacy settings
    profile_public BOOLEAN DEFAULT true,
    stats_public BOOLEAN DEFAULT true,
    
    -- Account status
    active BOOLEAN DEFAULT true,
    banned BOOLEAN DEFAULT false,
    ban_reason TEXT,
    banned_at TIMESTAMPTZ,
    banned_by UUID REFERENCES users(id),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT username_format CHECK (username ~* '^[A-Za-z0-9_-]{3,50}$'),
    CONSTRAINT valid_role CHECK (role IN ('player', 'organizer', 'admin'))
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(active) WHERE active = true;
```

**Notes:**
- If using Supabase Auth, password_hash is handled externally
- Users can have multiple roles (organizer + player)
- Location is free-text for flexibility

---

### game_systems

Defines available game systems (Warmachine, MTG, Warhammer, etc.).

```sql
CREATE TABLE game_systems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL, -- URL-friendly: 'warmachine', 'mtg'
    description TEXT,
    active BOOLEAN DEFAULT true,
    
    -- Module configuration
    module_config JSONB, -- Game-specific settings
    pairing_algorithm VARCHAR(50), -- 'swiss', 'single_elim', 'double_elim'
    
    -- Display
    logo_url TEXT,
    icon_url TEXT,
    primary_color VARCHAR(7), -- Hex color
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_game_systems_active ON game_systems(active) WHERE active = true;
CREATE INDEX idx_game_systems_slug ON game_systems(slug);
```

**Example Data:**
```sql
INSERT INTO game_systems (name, slug, pairing_algorithm, active) VALUES
('Warmachine', 'warmachine', 'swiss', true),
('Magic: The Gathering', 'mtg', 'swiss', false), -- Not yet implemented
('Warhammer 40k', 'warhammer40k', 'swiss', false);
```

---

### formats

Tournament formats within each game system (Steamroller, Standard, Modern, etc.).

```sql
CREATE TABLE formats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_system_id UUID NOT NULL REFERENCES game_systems(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT true,
    
    -- Format rules
    rules_json JSONB, -- Format-specific rules and settings
    point_levels INTEGER[], -- For Warmachine: [30, 50, 75, 100]
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(game_system_id, slug)
);

CREATE INDEX idx_formats_game_system ON formats(game_system_id);
CREATE INDEX idx_formats_active ON formats(active) WHERE active = true;
```

**Example Data:**
```sql
INSERT INTO formats (game_system_id, name, slug, point_levels) VALUES
((SELECT id FROM game_systems WHERE slug = 'warmachine'), 
 'Steamroller 2025', 
 'steamroller-2025', 
 ARRAY[30, 50, 75, 100]);
```

---

### tournaments

Core tournament information.

```sql
CREATE TABLE tournaments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Game configuration
    game_system_id UUID NOT NULL REFERENCES game_systems(id),
    format_id UUID NOT NULL REFERENCES formats(id),
    point_level INTEGER, -- For Warmachine: 30, 50, 75, or 100
    
    -- Organization
    organizer_id UUID NOT NULL REFERENCES users(id),
    location VARCHAR(255),
    venue_name VARCHAR(255),
    venue_address TEXT,
    
    -- Dates and times
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    registration_deadline TIMESTAMPTZ,
    check_in_start TIMESTAMPTZ,
    check_in_end TIMESTAMPTZ,
    
    -- Capacity
    max_players INTEGER,
    min_players INTEGER DEFAULT 4,
    
    -- Tournament settings
    rounds_count INTEGER, -- Can be calculated, but stored for quick access
    use_cut_to_top BOOLEAN DEFAULT false,
    cut_to_top_number INTEGER, -- e.g., 8 for top 8
    
    -- Status
    status VARCHAR(20) DEFAULT 'draft', 
    -- 'draft', 'registration', 'check_in', 'in_progress', 'completed', 'cancelled'
    
    -- Settings (game-specific)
    settings JSONB, -- Scenario selection method, terrain rules, etc.
    
    -- Visibility
    public BOOLEAN DEFAULT true,
    registration_open BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_status CHECK (status IN ('draft', 'registration', 'check_in', 'in_progress', 'completed', 'cancelled')),
    CONSTRAINT valid_max_players CHECK (max_players IS NULL OR max_players >= min_players),
    CONSTRAINT valid_point_level CHECK (point_level > 0)
);

CREATE INDEX idx_tournaments_game_system ON tournaments(game_system_id);
CREATE INDEX idx_tournaments_format ON tournaments(format_id);
CREATE INDEX idx_tournaments_organizer ON tournaments(organizer_id);
CREATE INDEX idx_tournaments_status ON tournaments(status);
CREATE INDEX idx_tournaments_start_date ON tournaments(start_date);
CREATE INDEX idx_tournaments_public ON tournaments(public) WHERE public = true;
```

**Settings JSONB Examples:**

For Warmachine:
```json
{
  "scenario_selection": "random", // or "chosen_by_to", "sequential"
  "terrain_method": "quadrant",
  "deathclock_enabled": true,
  "allow_concessions": true,
  "require_painted_models": false,
  "painting_standard": "three_color_minimum"
}
```

---

### tournament_entries

Players registered for tournaments.

```sql
CREATE TABLE tournament_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Registration
    registration_timestamp TIMESTAMPTZ DEFAULT NOW(),
    checked_in BOOLEAN DEFAULT false,
    check_in_timestamp TIMESTAMPTZ,
    
    -- Status during tournament
    dropped BOOLEAN DEFAULT false,
    drop_round INTEGER, -- Which round they dropped after
    drop_reason TEXT,
    
    -- Lists (for games with list submission)
    list_data JSONB, -- Stores army list info, deck lists, etc.
    
    -- Tournament tracking
    tournament_points INTEGER DEFAULT 0, -- Wins
    victory_points INTEGER DEFAULT 0, -- Total scenario points
    army_points_destroyed INTEGER DEFAULT 0,
    strength_of_schedule DECIMAL(10, 2), -- Calculated
    
    -- Pairing tracking
    opponents_faced UUID[], -- Array of tournament_entry ids
    times_paired_down INTEGER DEFAULT 0,
    byes_received INTEGER DEFAULT 0,
    
    -- Final placement
    final_rank INTEGER,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(tournament_id, player_id),
    CONSTRAINT valid_drop_round CHECK (drop_round IS NULL OR drop_round > 0)
);

CREATE INDEX idx_tournament_entries_tournament ON tournament_entries(tournament_id);
CREATE INDEX idx_tournament_entries_player ON tournament_entries(player_id);
CREATE INDEX idx_tournament_entries_checked_in ON tournament_entries(tournament_id, checked_in);
CREATE INDEX idx_tournament_entries_active ON tournament_entries(tournament_id) WHERE dropped = false;
CREATE INDEX idx_tournament_entries_tournament_points ON tournament_entries(tournament_id, tournament_points DESC);
```

**list_data JSONB Example (Warmachine):**
```json
{
  "list_1": {
    "leader": "Captain Cynthia Rosko",
    "faction": "Crucible Guard",
    "army_points": 75,
    "models": [...],
    "command_cards": [...]
  },
  "list_2": {
    "leader": "Magnus the Unstoppable",
    "faction": "Mercenaries",
    "army_points": 75,
    "models": [...],
    "command_cards": [...]
  }
}
```

---

### rounds

Tournament rounds.

```sql
CREATE TABLE rounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    round_number INTEGER NOT NULL,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed'
    
    -- Timing
    scheduled_start TIMESTAMPTZ,
    actual_start TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    
    -- Round-specific settings
    scenario_id UUID, -- For games with scenarios (Warmachine)
    time_limit_minutes INTEGER, -- Per player
    
    -- Pairing metadata
    pairing_method VARCHAR(50), -- 'swiss', 'random', 'manual'
    pairing_generated_at TIMESTAMPTZ,
    pairing_generated_by UUID REFERENCES users(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(tournament_id, round_number),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'in_progress', 'completed')),
    CONSTRAINT valid_round_number CHECK (round_number > 0)
);

CREATE INDEX idx_rounds_tournament ON rounds(tournament_id);
CREATE INDEX idx_rounds_tournament_round ON rounds(tournament_id, round_number);
CREATE INDEX idx_rounds_status ON rounds(status);
```

---

### matches

Individual matches within rounds.

```sql
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    round_id UUID NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,
    
    -- Players
    player1_entry_id UUID NOT NULL REFERENCES tournament_entries(id),
    player2_entry_id UUID REFERENCES tournament_entries(id), -- NULL for bye
    
    -- Match assignment
    table_number INTEGER,
    
    -- Results
    result VARCHAR(20), -- 'player1_win', 'player2_win', 'draw', 'bye', 'in_progress', 'not_started'
    victory_condition VARCHAR(30), -- 'assassination', 'scenario', 'deathclock', 'bye', 'concession'
    
    -- Scoring
    player1_victory_points INTEGER DEFAULT 0,
    player2_victory_points INTEGER DEFAULT 0,
    player1_army_destroyed INTEGER DEFAULT 0,
    player2_army_destroyed INTEGER DEFAULT 0,
    
    -- Timing (for deathclock)
    player1_time_remaining INTEGER, -- Seconds remaining
    player2_time_remaining INTEGER,
    
    -- Match tracking
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    reported_at TIMESTAMPTZ,
    reported_by UUID REFERENCES users(id), -- Who reported result
    
    -- Verification
    verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES users(id),
    
    -- Notes
    notes TEXT,
    disputed BOOLEAN DEFAULT false,
    dispute_reason TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_result CHECK (result IN ('player1_win', 'player2_win', 'draw', 'bye', 'in_progress', 'not_started')),
    CONSTRAINT valid_victory_condition CHECK (victory_condition IN ('assassination', 'scenario', 'deathclock', 'bye', 'concession', 'default'))
);

CREATE INDEX idx_matches_round ON matches(round_id);
CREATE INDEX idx_matches_player1 ON matches(player1_entry_id);
CREATE INDEX idx_matches_player2 ON matches(player2_entry_id);
CREATE INDEX idx_matches_result ON matches(result);
CREATE INDEX idx_matches_table ON matches(round_id, table_number);
```

---

### player_statistics

Aggregated player statistics per game system.

```sql
CREATE TABLE player_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_system_id UUID NOT NULL REFERENCES game_systems(id) ON DELETE CASCADE,
    format_id UUID REFERENCES formats(id), -- NULL = all formats
    
    -- Win/Loss record
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    draws INTEGER DEFAULT 0,
    byes INTEGER DEFAULT 0,
    
    -- Tournament performance
    tournaments_played INTEGER DEFAULT 0,
    tournaments_won INTEGER DEFAULT 0,
    top_4_finishes INTEGER DEFAULT 0,
    top_8_finishes INTEGER DEFAULT 0,
    
    -- Scoring stats
    total_victory_points INTEGER DEFAULT 0,
    total_army_destroyed INTEGER DEFAULT 0,
    average_victory_points DECIMAL(10, 2),
    average_army_destroyed DECIMAL(10, 2),
    
    -- Placement
    average_placement DECIMAL(10, 2),
    best_placement INTEGER,
    
    -- Ratings (optional - for future ELO/ranking system)
    rating INTEGER DEFAULT 1500,
    peak_rating INTEGER DEFAULT 1500,
    
    -- Metadata
    last_tournament_date TIMESTAMPTZ,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(player_id, game_system_id, format_id)
);

CREATE INDEX idx_player_statistics_player ON player_statistics(player_id);
CREATE INDEX idx_player_statistics_game_system ON player_statistics(game_system_id);
CREATE INDEX idx_player_statistics_rating ON player_statistics(game_system_id, rating DESC);
```

---

## Warmachine-Specific Tables

### warmachine_scenarios

The 6 official Steamroller scenarios.

```sql
CREATE TABLE warmachine_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    
    -- Victory conditions
    scenario_victory_points_required INTEGER DEFAULT 3, -- Points ahead to win
    fixed_game_length INTEGER DEFAULT 7, -- Turns
    
    -- Scenario elements
    elements JSONB, -- Objectives, flags, caches placement
    special_rules JSONB, -- Kill box, moving objectives, etc.
    
    -- For random selection
    dice_value INTEGER, -- 1-6 for d6 roll
    
    active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_warmachine_scenarios_active ON warmachine_scenarios(active) WHERE active = true;
CREATE INDEX idx_warmachine_scenarios_dice ON warmachine_scenarios(dice_value);
```

**Example Data:**
```sql
INSERT INTO warmachine_scenarios (name, slug, dice_value, elements, special_rules) VALUES
('Color Guard', 'color-guard', 1, 
 '{"objectives_50mm": 2, "caches": 2, "flags": 2}',
 '{"kill_box": true, "flag_placement": "after_scoring"}'
),
('Trench Warfare', 'trench-warfare', 2,
 '{"objectives_50mm": 2, "objectives_40mm": 2, "flags": 2, "caches": 2}',
 '{"earthworks": true, "kill_box": true}'
);
-- ... repeat for all 6 scenarios
```

---

### warmachine_armies

Army lists for Warmachine players.

```sql
CREATE TABLE warmachine_armies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_entry_id UUID NOT NULL REFERENCES tournament_entries(id) ON DELETE CASCADE,
    list_number INTEGER NOT NULL, -- 1 or 2
    
    -- Army details
    faction VARCHAR(100) NOT NULL,
    leader_name VARCHAR(255) NOT NULL,
    army_points INTEGER NOT NULL,
    
    -- Full list data
    army_list_json JSONB NOT NULL, -- Complete army list with all models
    command_cards VARCHAR(100)[], -- Array of 5 command cards
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(tournament_entry_id, list_number),
    CONSTRAINT valid_list_number CHECK (list_number IN (1, 2)),
    CONSTRAINT valid_command_cards CHECK (array_length(command_cards, 1) = 5)
);

CREATE INDEX idx_warmachine_armies_entry ON warmachine_armies(tournament_entry_id);
CREATE INDEX idx_warmachine_armies_faction ON warmachine_armies(faction);
CREATE INDEX idx_warmachine_armies_leader ON warmachine_armies(leader_name);
```

---

### warmachine_match_details

Warmachine-specific match information.

```sql
CREATE TABLE warmachine_match_details (
    match_id UUID PRIMARY KEY REFERENCES matches(id) ON DELETE CASCADE,
    scenario_id UUID REFERENCES warmachine_scenarios(id),
    
    -- Lists used
    player1_list_used INTEGER, -- 1 or 2
    player2_list_used INTEGER,
    
    -- Additional game data
    terrain_setup JSONB, -- Optional: record terrain placement
    turn_count INTEGER, -- How many turns were played
    
    -- Scenario-specific tracking
    player1_objectives_secured INTEGER DEFAULT 0,
    player2_objectives_secured INTEGER DEFAULT 0,
    player1_caches_scored INTEGER DEFAULT 0,
    player2_caches_scored INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_list_used CHECK (player1_list_used IN (1, 2) AND player2_list_used IN (1, 2))
);

CREATE INDEX idx_warmachine_match_scenario ON warmachine_match_details(scenario_id);
```

---

## Supporting Tables

### notifications

Push notifications and alerts.

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification content
    type VARCHAR(50) NOT NULL, -- 'pairing_posted', 'round_starting', 'result_required', etc.
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Related entities
    tournament_id UUID REFERENCES tournaments(id),
    round_id UUID REFERENCES rounds(id),
    match_id UUID REFERENCES matches(id),
    
    -- Delivery
    read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    delivered BOOLEAN DEFAULT false,
    delivered_at TIMESTAMPTZ,
    
    -- Metadata
    priority INTEGER DEFAULT 0, -- Higher = more important
    expires_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_priority CHECK (priority >= 0 AND priority <= 10)
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE read = false;
CREATE INDEX idx_notifications_tournament ON notifications(tournament_id);
```

---

### audit_log

System audit trail for admin actions.

```sql
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Who and when
    actor_id UUID REFERENCES users(id), -- NULL for system actions
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- 'user', 'tournament', 'match', etc.
    entity_id UUID NOT NULL,
    
    -- What changed
    changes JSONB, -- Before/after data
    reason TEXT,
    
    -- Context
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_log_actor ON audit_log(actor_id);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at DESC);
```

---

## Views

### Current Tournament Standings

Materialized view for quick standings access.

```sql
CREATE MATERIALIZED VIEW tournament_standings AS
SELECT 
    te.id AS entry_id,
    te.tournament_id,
    te.player_id,
    u.display_name,
    u.username,
    te.tournament_points,
    te.victory_points,
    te.army_points_destroyed,
    te.strength_of_schedule,
    te.dropped,
    te.final_rank,
    RANK() OVER (
        PARTITION BY te.tournament_id 
        ORDER BY 
            te.tournament_points DESC,
            te.strength_of_schedule DESC,
            te.victory_points DESC,
            te.army_points_destroyed DESC
    ) AS current_rank
FROM tournament_entries te
JOIN users u ON te.player_id = u.id
WHERE te.dropped = false;

CREATE UNIQUE INDEX idx_tournament_standings_entry ON tournament_standings(entry_id);
CREATE INDEX idx_tournament_standings_tournament ON tournament_standings(tournament_id, current_rank);

-- Refresh after each round completes
```

---

## Database Functions

### Calculate Strength of Schedule

```sql
CREATE OR REPLACE FUNCTION calculate_strength_of_schedule(
    entry_id UUID
) RETURNS DECIMAL AS $$
DECLARE
    total_opponent_tp INTEGER;
BEGIN
    SELECT COALESCE(SUM(te.tournament_points), 0)
    INTO total_opponent_tp
    FROM tournament_entries te
    WHERE te.id = ANY(
        SELECT unnest(opponents_faced) 
        FROM tournament_entries 
        WHERE id = entry_id
    );
    
    RETURN total_opponent_tp;
END;
$$ LANGUAGE plpgsql;
```

### Update Tournament Entry Stats

```sql
CREATE OR REPLACE FUNCTION update_tournament_entry_stats(
    p_tournament_id UUID
) RETURNS VOID AS $$
BEGIN
    UPDATE tournament_entries te
    SET 
        tournament_points = (
            SELECT COUNT(*) 
            FROM matches m
            JOIN rounds r ON m.round_id = r.id
            WHERE r.tournament_id = p_tournament_id
            AND (
                (m.player1_entry_id = te.id AND m.result = 'player1_win')
                OR (m.player2_entry_id = te.id AND m.result = 'player2_win')
                OR (m.result = 'bye' AND m.player1_entry_id = te.id)
            )
        ),
        victory_points = (
            SELECT COALESCE(
                SUM(CASE 
                    WHEN m.player1_entry_id = te.id THEN m.player1_victory_points
                    WHEN m.player2_entry_id = te.id THEN m.player2_victory_points
                    ELSE 0
                END), 0)
            FROM matches m
            JOIN rounds r ON m.round_id = r.id
            WHERE r.tournament_id = p_tournament_id
            AND (m.player1_entry_id = te.id OR m.player2_entry_id = te.id)
        ),
        army_points_destroyed = (
            SELECT COALESCE(
                SUM(CASE 
                    WHEN m.player1_entry_id = te.id THEN m.player1_army_destroyed
                    WHEN m.player2_entry_id = te.id THEN m.player2_army_destroyed
                    ELSE 0
                END), 0)
            FROM matches m
            JOIN rounds r ON m.round_id = r.id
            WHERE r.tournament_id = p_tournament_id
            AND (m.player1_entry_id = te.id OR m.player2_entry_id = te.id)
        ),
        strength_of_schedule = calculate_strength_of_schedule(te.id)
    WHERE te.tournament_id = p_tournament_id;
END;
$$ LANGUAGE plpgsql;
```

---

## Migration Strategy

### Phase 1: Core Tables
1. users
2. game_systems
3. formats
4. tournaments
5. tournament_entries

### Phase 2: Tournament Operations
6. rounds
7. matches
8. notifications

### Phase 3: Statistics
9. player_statistics
10. audit_log

### Phase 4: Game Modules
11. warmachine_scenarios
12. warmachine_armies
13. warmachine_match_details

### Phase 5: Optimization
14. Create views
15. Add functions
16. Add triggers for auto-calculations

---

## Data Integrity Rules

### Triggers

**Update timestamps automatically:**
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply to all tables with updated_at column
```

**Prevent pairing against same opponent:**
```sql
CREATE OR REPLACE FUNCTION check_no_rematch()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM tournament_entries te1
        WHERE te1.id = NEW.player1_entry_id
        AND NEW.player2_entry_id = ANY(te1.opponents_faced)
    ) THEN
        RAISE EXCEPTION 'Players have already faced each other';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_rematch BEFORE INSERT ON matches
    FOR EACH ROW EXECUTE FUNCTION check_no_rematch();
```

---

## Backup and Maintenance

**Recommended Schedule:**
- Full backup: Daily
- Transaction log backup: Hourly
- Retention: 30 days minimum

**Performance Maintenance:**
- VACUUM ANALYZE: Weekly
- Reindex: Monthly
- Update statistics: After large data imports

---

## Notes for Developers

1. **Use UUIDs** for all primary keys (better for distributed systems)
2. **JSONB fields** allow flexibility without schema changes
3. **Indexes are critical** for tournament queries with many players
4. **Materialized views** for standings should refresh after each round
5. **Foreign key constraints** ensure referential integrity
6. **Check constraints** prevent invalid data states
7. **Triggers** automate common calculations
8. **Audit logging** tracks all admin actions

---

**Document Version:** 1.0  
**Last Updated:** October 22, 2025  
**Next Review:** After initial implementation
