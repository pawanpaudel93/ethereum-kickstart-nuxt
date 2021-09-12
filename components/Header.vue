<template>
  <div>
    <v-app-bar color="blue accent-4" dense dark>
      <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->

      <v-toolbar-title @click="$router.push('/')" style="cursor: pointer">
        CrowdCoin
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn text to="/"> Campaigns </v-btn>
        <v-btn icon to="/campaigns/new/">
          <v-icon> mdi-plus-circle </v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
  </div>
</template>

<script>
export default {}
</script>
