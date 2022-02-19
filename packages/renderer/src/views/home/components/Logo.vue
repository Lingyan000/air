<script lang="ts" setup>
  import { NGradientText } from 'naive-ui';
</script>

<template>
  <n-gradient-text type="info" :class="$style.homeAirLogo"> Air </n-gradient-text>
</template>

<style module>
  .homeAirLogo {
    margin-top: 120px;
    font-size: 50px;
    user-select: none;
  }
</style>
