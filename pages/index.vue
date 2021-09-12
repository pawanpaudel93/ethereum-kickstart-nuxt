<template>
  <v-container>
    <h3>Open Campaigns</h3>
    <v-btn color="primary" class="float-right" to="/campaigns/new/">
      <v-icon left> mdi-plus-circle </v-icon>Add Campaign
    </v-btn>
    <v-row>
      <v-col sm="12" v-for="campaign in campaigns" :key="campaign">
        <v-card>
          <v-card-title>{{ campaign }}</v-card-title>
          <v-card-actions>
            <v-btn
              text
              color="deep-purple accent-4"
              :to="'/campaigns/' + campaign"
            >
              View Campaign
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import factory from '@/ethereum/factory'
export default {
  data() {
    return {}
  },
  async asyncData({}) {
    const campaigns = await factory.methods.getDeployedCampaigns().call()
    return { campaigns }
  },
}
</script>