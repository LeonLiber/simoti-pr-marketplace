<template>

  <section>

    <el-table :data="articles" border style="width: 100%">
      <el-table-column type="expand">
        <template scope="props">
          <h2>Article Assets</h2>
          <div v-if="assetsAvaialble(props.row)">No assets</div>
          <ul class="files-list">
            <li v-if="props.row.url !== ''">
              <a :href="props.row.url" target="_blank"><i class="el-icon-share"></i> Article URL</a>
            </li>
            <li v-for="(file, index) in props.row.files">
              <a :href="file" target="_blank"><i class="el-icon-document"></i>File #{{index+1}}</a>
            </li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="Article"></el-table-column>
      <el-table-column prop="publication" label="Publication"></el-table-column>
      <el-table-column label="Actions" width="150">
        <template scope="scope">
          <el-button type="text" @click="showDialog(scope.row)">
            {{actionButtonText}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Dialog -->
    <el-dialog title="Article Propositions" v-model="dialogVisible">
      <article-propositions
        v-if="isItemOwner"
        :item="currentItem"
        :visible="dialogVisible"
        @close="closeDialog">
      </article-propositions>
      <article-propositions-slim
        v-else
        :item="currentItem"
        :visible="dialogVisible"
        @close="closeDialog">
      </article-propositions-slim>
    </el-dialog>
    <!-- /Dialog -->

  </section>

</template>

<script>
import ArticlePropositions from './ArticlePropositions';
import ArticlePropositionsSlim from './ArticlePropositionsSlim';

export default {
  name: 'articles',
  props: ['type'],
  components: {
    ArticlePropositions,
    ArticlePropositionsSlim,
  },
  data() {
    return {
      dialogVisible: false,
      isItemOwner: false,
      currentItem: {},
    };
  },
  computed: {
    articles() {
      if (this.type === 'ownArticles') {
        return this.$store.getters.userArticles;
      } else {
        return this.$store.getters.articles;
      }
    },
    actionButtonText() {
      return this.type === 'ownArticles' ? 'Show Propositions' : 'Add Proposition';
    },
  },
  methods: {
    showDialog(item) {
      this.dialogVisible = true;
      this.currentItem = item;
      this.isItemOwner = this.currentItem.userId === this.$store.getters.user.email;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    assetsAvaialble(row) {
      return (row.url === '' && row.files.length === 0);
    },
  },
  mounted() {
    if (this.type === 'ownArticles') {
      this.$store.dispatch('getUserArticles');
    } else {
      this.$store.dispatch('getArticles');
    }
  },
};
</script>

<style scoped>
  a {
    color: inherit;
    text-decoration: none;
  }
  .files-list {
    list-style: none;
  }
  .files-list li {
    margin: 5px;
    font-size: 16px;
    color: #48576a;
    line-height: 1.8;
    border-radius: 6px;
    transition: color .3s;
  }
  .files-list li:hover {
    background-color: #eef1f6;
    color: #20a0ff;
    cursor: pointer;
  }
  .files-list li a {
    display: block;
    padding: 5px;
  }
  .files-list li i {
    margin-right: 8px;
  }
</style>
