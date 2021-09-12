<template>
  <v-container>
    <h2>Requests</h2>
    <v-btn
      :to="$route.fullPath + '/new'"
      color="primary"
      class="mr-4 float-right"
    >
      Add Request
    </v-btn>
    <v-card class="mt-10">
      <v-card-title>
        Requests
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="requests"
        :search="search"
        :item-class="rowClasses"
      >
        <template slot="item.id" slot-scope="props">
          {{ props.index + 1 }}
        </template>
        <template v-slot:item.value="{ item }">
          {{ web3.utils.fromWei(item.value, 'ether') }}
        </template>
        <template v-slot:item.approvalCount="{ item }">
          {{ item.approvalCount }}/{{ approversCount }}
        </template>
        <template slot="item.approve" slot-scope="props">
          <v-btn
            v-if="!props.item.complete"
            color="green"
            @click="onApprove(props.index)"
            outlined
            >Approve</v-btn
          >
        </template>
        <template slot="item.finalize" slot-scope="props">
          <v-btn
            v-if="!props.item.complete"
            color="teal"
            @click="onFinalize(props.index)"
            outlined
            >Finalize</v-btn
          >
        </template>
      </v-data-table>
    </v-card>
    <span v-if="requests.length > 0">Found {{ requests.length }} requests</span>
  </v-container>
</template>

<script>
import web3 from '@/ethereum/web3'
import Campaign from '@/ethereum/campaign'
export default {
  async asyncData({ params }) {
    try {
      const address = params.address
      const campaign = Campaign(address)
      const requestCount = await campaign.methods.getRequestsCount().call()
      const approversCount = await campaign.methods.approversCount().call()
      const promises = []
      for (let i = 0; i < requestCount; i++) {
        promises.push(campaign.methods.requests(i).call())
      }
      const requests = await Promise.all(promises)
      return { approversCount, address, requests, requestCount }
    } catch (error) {
      console.error(error)
    }
  },
  data() {
    return {
      web3: web3,
      search: '',
      headers: [
        {
          text: 'ID',
          align: 'start',
          sortable: true,
          value: 'id',
        },
        { text: 'Description', value: 'description' },
        { text: 'Amount', value: 'value' },
        { text: 'Recipient', value: 'recipient' },
        { text: 'Approval Count', value: 'approvalCount' },
        { text: 'Approve', value: 'approve' },
        { text: 'Finalize', value: 'finalize' },
      ],
    }
  },
  methods: {
    async onApprove(index) {
      try {
        const campaign = Campaign(this.$route.params.address)
        const accounts = await web3.eth.getAccounts()
        await campaign.methods.approveRequest(index).send({
          from: accounts[0],
        })
        this.$nuxt.refresh()
      } catch (err) {
        console.log(err)
      }
    },
    async onFinalize(index) {
      try {
        const campaign = Campaign(this.$route.params.address)
        const accounts = await web3.eth.getAccounts()
        await campaign.methods.finalizeRequest(index).send({
          from: accounts[0],
        })
        this.$nuxt.refresh()
      } catch (err) {
        console.log(err)
      }
    },
    rowClasses(item) {
      if (item.complete) {
        return 'text--disabled'
      } else if (
        item.approvalCount > this.approversCount / 2 &&
        !item.complete
      ) {
        return 'green--text'
      }
    },
  },
}
</script>