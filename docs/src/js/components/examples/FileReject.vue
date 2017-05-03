<template>
    <div class="columns is-multiline">
        <div class="column is-12">
            <label class="label">Image (Doesn't Reject)</label>
            <p class="control has-icon has-icon-right">
                <input name="image" v-validate="'mimes:image/*'" :class="{ 'is-danger': errors.has('image') }" type="file">
                <i v-show="errors.has('image')" class="fa fa-warning"></i>
                <span v-show="errors.has('image')" class="help is-danger">{{ errors.first('image') }}</span>
            </p>
        </div>
        <div class="column is-12">
            <label class="label">Image (Rejects)</label>
            <p class="control has-icon has-icon-right">
                <input name="file" v-validate.reject="'mimes:image/*'" :class="{ 'is-danger': errors.has('file') }" type="file">
                <i v-show="errors.has('file')" class="fa fa-warning"></i>
                <span v-show="errors.has('file')" class="help is-danger">{{ errors.first('file') }}</span>
            </p>
        </div>
    </div>
</template>


<script>
  export default {
    name: 'reject-example'
  };
</script>
