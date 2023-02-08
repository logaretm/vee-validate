// https://inlang.com/documentation
export async function defineConfig(env) {
    const plugin = await env.$import(
        "https://cdn.jsdelivr.net/gh/samuelstroschein/inlang-plugin-json@1/dist/index.js"
    );

    const pluginConfig = {
        pathPattern: "./packages/i18n/src/locale/{language}.json",
    };

    return {
        referenceLanguage: "en",
        languages: await getLanguages(env),
        readResources: (args) =>
            plugin.readResources({ ...args, ...env, pluginConfig }),
        writeResources: (args) =>
            plugin.writeResources({ ...args, ...env, pluginConfig }),
    };
}



/**
 * Automatically derives the languages from the locale directory.
 */
async function getLanguages(env) {
    // replace the path
    const files = await env.$fs.readdir("./packages/i18n/src/locale");
    // files that end with .json
    // remove the .json extension to only get language name
    const languages = files.filter((name) => name.endsWith(".json")).map((name) => name.replace(".json", ""));
    return languages;
}