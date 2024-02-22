// @ts-ignore
import * as worker from "monaco-editor-core/esm/vs/editor/editor.worker";
import type * as monaco from "monaco-editor-core";

import { createTypeScriptWorkerService, ServiceEnvironment } from "@volar/monaco/worker";
import * as ts from "typescript";
import { create as createTypeScriptService } from "volar-service-typescript";

self.onmessage = () => {
	worker.initialize((ctx: monaco.worker.IWorkerContext) => {
		const env: ServiceEnvironment = {
			workspaceFolder: "file:///",
			typescript: {
				uriToFileName: (uri) => uri.substring("file://".length),
				fileNameToUri: (fileName) => "file://" + fileName,
			},
		};
		return createTypeScriptWorkerService({
			typescript: ts,
			compilerOptions: {
				...ts.getDefaultCompilerOptions(),
				allowJs: true,
				jsx: ts.JsxEmit.Preserve,
				module: ts.ModuleKind.ESNext,
				moduleResolution: ts.ModuleResolutionKind.NodeJs,
				lib: ["esnext", "dom"],
				target: ts.ScriptTarget.Latest,
				strict: true,
				noImplicitAny: true,
				experimentalDecorators: true,
				emitDecoratorMetadata: true,
				resolveJsonModule: true,
				esModuleInterop: true,
				skipLibCheck: true,
				allowSyntheticDefaultImports: true,
				isolatedModules: true,
				noEmit: true,
				baseUrl: ".",
			},
			workerContext: ctx,
			env,
			languagePlugins: [],
			servicePlugins: [createTypeScriptService(ts)],
		});
	});
};


