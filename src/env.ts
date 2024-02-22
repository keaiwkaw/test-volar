import { editor, languages } from "monaco-editor-core";
import editorWorker from "monaco-editor-core/esm/vs/editor/editor.worker?worker";
import tsWorker from "./ts.worker?worker";
import { LanguageService } from "@volar/monaco/worker";
import { activateAutoInsertion, activateMarkers, registerProviders } from "@volar/monaco";

export function setupMonacoEnv() {
	let initialized = false;

	languages.register({ id: "typescript", extensions: [".ts"] });
	languages.onLanguage("typescript", setup);
	async function setup() {
		if (initialized) return;
		initialized = true;

		(self as any).MonacoEnvironment ??= {};
		(self as any).MonacoEnvironment.getWorker ??= () => new editorWorker();

		const getWorker = (self as any).MonacoEnvironment.getWorker;

		(self as any).MonacoEnvironment.getWorker = (_: any, label: string) => {
			if (label === "typescript") {
				return new tsWorker();
			}
			return getWorker();
		};

		const worker = editor.createWebWorker<LanguageService>({
			moduleId: "vs/language/typescript/typescriptWorker",
			label: "typescript",
		});
		const languageId = ["typescript"];
		const getSyncUris = () => editor.getModels().map((model) => model.uri);

		activateMarkers(worker, languageId, "typescript", getSyncUris, editor);
		// activateAutoInsertion(worker, languageId, getSyncUris, editor);
		registerProviders(worker, 'typescript', getSyncUris, languages);
	}
}
