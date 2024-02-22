<script setup lang="ts">
import { onMounted } from 'vue';
import { Uri, editor } from 'monaco-editor-core';
import * as monaco from 'monaco-editor-core'
import { setupMonacoEnv } from './env';

onMounted(() => {
  setupMonacoEnv()

  function getOrCreateModel(
    uri: Uri,
    lang: string | undefined,
    value: string
  ) {
    const model = editor.getModel(uri);
    if (model) {
      model.setValue(value);
      return model;
    }
    return editor.createModel(value, lang, uri);
  }

  const model = getOrCreateModel(
    monaco.Uri.parse("file:///demo.ts"),
    "typescript",
    "import a from 'lodash'"
  );

  editor.create(document.getElementById('editor')!, {
    model,
    automaticLayout: true,
    scrollBeyondLastLine: false,
    minimap: {
      enabled: false,
    },
    inlineSuggest: {
      enabled: false,
    },
    "semanticHighlighting.enabled": true,
  })
})


</script>

<template>
  <div id="editor">

  </div>
</template>

<style scoped>
#editor {
  height: 100%;
  width: 100%;
}
</style>
