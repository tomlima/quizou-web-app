<template>
  <div class="uploader flex flex-col gap-5 items-center">
    <input @change="selectFile" id="file-upload" type="file" name="fileUpload" accept="image/*" />
    <label for="file-upload" class="flex items-center justify-center flex-col" id="file-drag">
      <div class="my-5 w-full h-[180px] md:w-[250px] md:h-[180px] rounded-xl">
        <img v-if="returnedFileName" class="w-full h-full object-cover rounded-xl" :src="returnedFileName" alt="Preview">
      </div>
      <div id="upload__wrapper">
        <UIcon name="i-lucide-upload" class="size-10" />
        <div>Select a file or drag here</div>
        <span id="file-upload-btn" class="btn btn-primary">Select a file</span>
      </div>
    </label>
    <UProgress v-if="isUploading" />
    <UAlert
      v-if="error"
      class="flex flex-start items-start"
      title="Ops, o upload de imagem falhou!"
      color="error"
      variant="subtle"
      icon="i-lucide-server-crash"
    />
  </div>
</template>

<script setup>
const {
  file,
  uploadProgress,
  isUploading,
  error,
  selectFile,
  uploadFile,
  returnedFileName
} = useFileUpload()

const emit = defineEmits(['update:returnedFileName'])

watch(returnedFileName, (newVal) => {
  if (newVal) {
    emit('update:returnedFileName', newVal)
  }
})
</script>

<style scoped lang="scss">
$theme:       #615fff;
$dark-text:   #5f6982;

.uploader {
  max-width: 600px;
  label {
    width: 100%;
    padding: 2rem 1.5rem;
    text-align: center;
    background: #fff;
    border-radius: 7px;
    border: 3px dotted #eee;
    transition: all .2s ease;
    user-select: none;

    &:hover {
      border-color: $theme;
    }
    &.hover {
      border: 3px solid $theme;
      box-shadow: inset 0 0 0 6px #eee;  
    }
  }

  
  input[type="file"] {
    display: none;
  }

  .btn {
    display: inline-block;
    margin: .5rem .5rem 1rem .5rem;
    clear: both;
    font-family: inherit;
    font-weight: 700;
    font-size: 14px;
    text-decoration: none;
    text-transform: initial;
    border: none;
    border-radius: .2rem;
    outline: none;
    padding: 0 1rem;
    height: 36px;
    line-height: 36px;
    color: #fff;
    transition: all 0.2s ease-in-out;
    box-sizing: border-box;
    background: $theme;
    border-color: $theme;
    cursor: pointer;
  }
}
</style>
