import { YAML } from "bun";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, "..");

const baseJsonPath = join(projectRoot, "docs.base.json");
const yamlNavPath = join(projectRoot, "navigation.yaml");
const outputPath = join(projectRoot, "docs.json");

async function parseNavigationYaml() {
  try {
    const baseConfigText = await fs.readFile(baseJsonPath, "utf8");
    const baseConfig = JSON.parse(baseConfigText);

    const yamlContent = await fs.readFile(yamlNavPath, "utf8");
    const navigation = YAML.parse(yamlContent);

    baseConfig.navigation = navigation;

    await fs.writeFile(outputPath, JSON.stringify(baseConfig, null, 2));

    console.log(`✅ Successfully generated ${outputPath}`);
  } catch (e) {
    console.error("❌ Error during generation:", e.message);
    process.exit(1);
  }
}

parseNavigationYaml();
