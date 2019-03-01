<!-- FlipSlide Application -->
<!--
  Welcome to FlipSlide!

  FlipSlide is a web application for drawing and other stuff! It prioritizes
  portability and freedom by running on a web browser.

  ACTIONS can be stored on a remote server and replayed or stored locally.
  to store actions on a remote server and running commands to offload heavy tasks.

  FLOW
  +SESSION START
    + COOKIE NOT FOUND
      Prompt to ask for permission to use the server.
      PROMPT:
        Welcome to FlipSlide! It's a pleasure to meet and/or see you again!
        Before you use this we're going to have to ask you to ask us permission
        to use it, is that okay?

      - if [user] OK and [server] OK
        This implies that storing cookies is fine with the user and a cookie is stored
        that prevents this message on load. A user SESSION is started.

      - if [user] OK and [server] NO
        this implies the user has been banned from the server for a reason.
        The user can compile their own back end.

      - if [user] NO
        The user is directed to a git repository and directions on how to install
        flipslide locally

    + COOKIE FOUND
      If a user has a permission cookie stored they are automatically granted a session.
      USER is gifted a blank book. The dimensions of the book are taken from the
      dimensions of the browser window.

    - Record session start
    - If user session has BOOK INDEX
      Open Book at SESSION -> BOOK INDEX

  + SESSION CLOSED
    - Record session end
  -->

<template>
  <div id="app">

    <v-app>
      <!-- TODO: use session.books -->
      <v-container fluid pa-0 ma-0>
        <v-btn id="FSBtn" @click="showInterface = !showInterface">FlipSlide</v-btn>

        <v-slide-y-transition>
          <interface v-show="showInterface" />
        </v-slide-y-transition>

        <v-slider step=".1" @input="scaling" style="z-index: 9999; position: relative;" v-model="cScale" :max="50" label="scale" />
        <v-slider step=".1" @input="rotating" style="z-index: 9999; position: relative;" v-model="cRot" :min="-1" :max="1" label="rotate" />

        <fsbook v-for="(book, ind) in books" :key="ind" />
        <fsdebug id="debug" v-show="$eventHub.debug" />
      </v-container>
    </v-app>

  </div>
</template>

<script>
  import FSBook from './FS_Book'
  import FSDebug from './FS_Debug'

  import Session from './util/Session'
  import Interface from './interface/Interface'

  export default {
    name: 'app',
    components: {
      fsbook: FSBook,
      fsdebug: FSDebug,
      interface: Interface,
    },

    data () {
      var width = window.innerWidth
      var height = window.innerHeight

      var current_session = new Session()

      // TODO a book should belong to a session.
      return {
        session: current_session,
        showInterface: false,
        cScale: 1,
        cRot: 0,
        books: [{
          title: 'test'
        }]
      }
    },

    methods: {
      addBook() {
        // Add book
      },

      removeBook() {
        // Remove/Hide book
      },

      resize (e) {
        // this.setFSBtn()
      },

      rotating(e) {
        this.$eventHub.$emit("rotate", e)
      },

      scaling(e) {
        this.$eventHub.$emit("scale", e)
      },

      setFSBtn () {
        let winh = window.innerHeight/2
        let winw = window.innerWidth/2
        let ref = this.$refs.fsbtn

        this.$refs.fsbtn.style.left = winw - ref.clientWidth/2 +'px'
        this.$refs.fsbtn.style.top = '10px'
      }
    },

    mounted() {
      this.$nextTick(() =>{
        window.addEventListener('resize', this.resize)
        // this.setFSBtn()
      })
     }

  }
</script>

<style>
  html {
    overflow: hidden;
  }
  #FSBtn{
    user-select: none;
    z-index: 9999;
  }
  #app{
    overflow: hidden;
    background-color:#CCC;
  }
  .canvas{
    position: absolute;
    left: 0px;
    top:0px;
  }
  #container{
    background-color:#FFF;
    width: 600px;
    height: 600px;
    position: absolute;
    box-shadow: 0px 0px 5px #222
  }
  #debugBtn{
    position: absolute;
    bottom: 0px;
    right: 0px;
    height: 60px;
    border: 2px solid;
    width: 60px;
    background-color:#F00;
    z-index: 9999;
  }
  .v-slider{
    z-index:100
  }
</style>
