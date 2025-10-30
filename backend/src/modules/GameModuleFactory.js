const WarmachineModule = require('./warmachine/WarmachineModule');

/**
 * Factory for creating game modules
 */
class GameModuleFactory {
  static getModule(gameSystem) {
    switch (gameSystem.toLowerCase()) {
      case 'warmachine':
        return new WarmachineModule();

      // Add more game systems here in the future
      // case 'warhammer40k':
      //   return new Warhammer40kModule();

      default:
        throw new Error(`Unsupported game system: ${gameSystem}`);
    }
  }

  static getSupportedSystems() {
    return ['warmachine'];
  }
}

module.exports = GameModuleFactory;
