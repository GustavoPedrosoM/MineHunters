const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

module.exports = async () => {
  const defaultConfig = await getDefaultConfig(__dirname);
  return mergeConfig(defaultConfig, {
    resolver: {
      assetExts: [...defaultConfig.resolver.assetExts, 'ttf'], // Adiciona 'ttf' como uma extensão de ativo suportada
    },
    // Aqui você pode adicionar outras configurações conforme necessário
  });
};