<<template>
 <div class="pagination">
  <div class="pagination__text">
  Showing {{startOffset}} - {{endOffset}} of {{totalCount}} results  
  </div>
  <div class="pagination__control-container">
  <div class="pagination__control">
    <a
      class="pagination__control-link"
      :class="{ 'pagination__control-link--disabled': currentPageNumber === 1 }"
      @click.prevent="fetchPage(currentPageNumber - 1)"
    >
      <div class="chevron chevron--left"></div>
    </a>
  </div>
  <div v-for="pageLink in pageLinks" class="pagination__control">
    <a
      class="pagination__control-link"
      :class="{ 'pagination__control-link--active': pageLink === currentPageNumber }"
      @click.prevent="fetchPage(pageLink)"
    >{{pageLink}}</a>
  </div>
  <div class="pagination__control">
    <a
      class="pagination__control-link"
      :class="{ 'pagination__control-link--disabled': (currentPageNumber + 1) > pageTotal }"
      @click.prevent="fetchPage(currentPageNumber + 1)"
    >
      <div class="chevron chevron--right"></div>
    </a>
  </div>
  </div>
</div> 
</template>

<script>
export default {
  name: "m2-pagination",
  props: {
    currentPage: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 0
    },
    totalCount: {
      type: Number,
      default: 0
    }
  },

  watch: {
    currentPage: function(newVal) {
      this.currentPageNumber = newVal;
    }
  },

  data() {
    return {
      MAX_PAGE_LINKS: 5,
      currentPageNumber: this.currentPage
    };
  },

  computed: {
    startOffset() {
      return this.pageSize * (this.currentPageNumber - 1);
    },

    endOffset() {
      return Math.min(this.totalCount, this.pageSize * this.currentPageNumber);
    },

    pageTotal() {
      return Math.ceil(this.totalCount / this.pageSize);
    },

    pageLinks() {
      let pageLinks = [];
      if (this.currentPageNumber >= this.MAX_PAGE_LINKS) {
        for (let i = 0; i < this.MAX_PAGE_LINKS; i++) {
          pageLinks.unshift(this.currentPageNumber - i);
        }
      } else {
        for (let i = 1; i <= this.pageTotal && i <= this.MAX_PAGE_LINKS; i++) {
          pageLinks.push(i);
        }
      }
      return pageLinks;
    }
  },

  methods: {
    fetchPage(pageNumber = 0) {
      this.currentPageNumber = pageNumber;
      this.$emit("pageChanged", this.currentPageNumber);
    }
  }
};
</script>

<style lang="scss" scoped>
$chevron-size: 10px;

.pagination {
  display: flex;
  justify-content: space-between;
  margin-top: 18px;
  font-size: 1rem;
  color: $color-white;

  &__control-container {
    display: flex;
  }

  &__control {
    margin-right: 10px;

    &:last-child {
      margin-right: 0;
    }
  }

  &__control-link {
    font-weight: 700;
    width: 5x;
    text-decoration: none;
    cursor: pointer;
    &:hover {
      color: $color-primary;
    }

    &--active {
      color: $color-primary;
      border-bottom: 2px solid;
    }

    &--disabled {
      pointer-events: none;
      opacity: 0.5;
    }
  }
}

.chevron {
  display: inline-block;
  margin: 0 5px;
  vertical-align: middle;
  &--left {
    width: $chevron-size;
    height: $chevron-size;
    border-right: solid $chevron-size $color-white;
    border-bottom: solid $chevron-size transparent;
    border-top: solid $chevron-size transparent;
  }

  &--right {
    width: $chevron-size;
    height: $chevron-size;
    border-left: solid $chevron-size $color-white;
    border-bottom: solid $chevron-size transparent;
    border-top: solid $chevron-size transparent;
  }
}
</style>

