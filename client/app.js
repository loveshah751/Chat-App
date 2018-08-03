// Chat Component
const chatComponent = {
    template: ` <div class="chat-box">
                   <p v-for="data in content">
                       <img :src="data.user.avatar" class="circle" width="30px">
                       <span><strong>{{data.user.name}}</strong> <small>{{data.date}}</small><span>
                       <br />
                       {{data.message}}
                   </p>
               </div>`,
    props: ['content']
}

// Users Component
const usersComponent = {
    template: ` <div class="user-list">
                   <h6>Active Users ({{users.length}})</h6>
                   <ul v-for="user in users">
                       <li>
                            <img :src="user.avatar" class="circle" width="30px">
                            <span>{{user.name}}</span><br>
                       </li>
                       <hr>
                   </ul>
               </div>`,
    props: ['users']
}

//Welcome Component
const welcomeComponent = {
    template: ` <div v-if="Object.keys(user).length">
        <li>
            <h3 style="margin-left:50px"> Welcome </h3>
            <h1 style="margin-left:70px; margin-top:-20px">  <img :src="user.avatar" class="circle" width="120px" height="150px"></h1>
            <h5 style="margin-left:100px;"> <span>{{user.name}}</span><br> </h5>
        </li>
        <hr>
      </div>`,
      props: ['user']
}

const socket = io()
const app = new Vue({
    el: '#chat-app',
    data: {
        loggedIn: false,
        userName: '',
        user: {},
        users: [],
        message: '',
        messages: [],
        error: false,
        // welcome_message:''
    },
    methods: {
        joinUser: function () {
            if (!this.userName)
                return

            socket.emit('join-user', this.userName)
        },
        sendMessage: function () {
            if (!this.message)
                return

            socket.emit('send-message', { message: this.message, user: this.user })
        }
    },
    components: {
        'users-component': usersComponent,
        'chat-component': chatComponent,
        'welcome-component':welcomeComponent
    }
})


// Client Side Socket Event
socket.on('refresh-messages', messages => {
    app.messages = messages
})
socket.on('refresh-users', users => {
    app.users = users
})

socket.on('failed-join',()=> {
    app.error=true;
})
socket.on('successful-join', user => {
    console.log(app.users.length);
    // the successful-join event is emitted on all connections (open browser windows)
    // so we need to ensure the loggedIn is set to true and user is set for matching user only
    if (user.name === app.userName) {
        app.user = user
        app.loggedIn = true
    }

    app.users.push(user)
})

socket.on('successful-message', content => {
    // clear the message after success send

    app.message = ''
    app.messages.push(content)
})
