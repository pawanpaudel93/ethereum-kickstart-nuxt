<template>
  <v-container>
    <h1>Campaign details</h1>
    <v-row>
      <v-col md="8">
        <v-row>
          <v-col sm="6" v-for="data in datas" :key="data.meta">
            <v-card height="100%">
              <v-card-title>{{ data.header }}</v-card-title>
              <v-card-subtitle>{{ data.meta }}</v-card-subtitle>
              <v-card-text>
                <div class="text--primary">
                  {{ data.description }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col>
        <contribute-form
          :address="$route.params.address"
          @contributed="$nuxt.refresh()"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          color="primary"
          :to="'/campaigns/' + $route.params.address + '/requests'"
          >View Requests</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Campaign from '@/ethereum/campaign'
import web3 from '@/ethereum/web3'
import ContributeForm from '~/components/ContributeForm.vue'
export default {
  components: {
    ContributeForm,
  },
  async asyncData({ route }) {
    const campaign = Campaign(route.params.address)
    const summary = await campaign.methods.getSummary().call()
    return {
      datas: [
        {
          header: summary[4],
          meta: 'Address of the manager',
          description:
            'The manager created this campaign and can create requests to withdraw funds.',
        },
        {
          header: summary[0],
          meta: 'Minimum Contribution (wei)',
          description:
            'You must contribute at least this much wei to become an approver',
        },
        {
          header: web3.utils.fromWei(summary[1], 'ether'),
          meta: 'Campaign Balance (ether)',
          description:
            'The balance is how much money this campaign has left to spend.',
        },
        {
          header: summary[2],
          meta: 'Number of Requests',
          description:
            'A request tries to withdraw money from the contract. Requests must be approved by approvers.',
        },
        {
          header: summary[3],
          meta: 'Number of Approvers',
          description:
            'An approver is someone who has donated money to this campaign.',
        },
      ],
    }
  },
}
</script>
