

const app = Vue.createApp({
    data(){
        return{
            password:'',
            email:'',
            users:[],
            errors:[]
        }
    },async created() {
        const resp= await axios.get("https://dcsibh9m73.execute-api.ap-southeast-1.amazonaws.com/prod/retrieveUsers.php")
        
        resp.data.forEach((each)=>{
            const eachObj = JSON.parse(each) //convert strings to JSON objs
    
            const user={
                'email': eachObj.email,
                'password':  eachObj.password,
            }
            this.users.push(user)
        }) 
    },methods:{
        login(){

            let count=0
            this.errors = []
            for(eachUser of this.users){
                if (this.email == eachUser.email){

                    let params={email: this.email, password: this.password}
                    axios.post('https://dcsibh9m73.execute-api.ap-southeast-1.amazonaws.com/prod/checkPasswordLogin.php', params)
                    .then(resp=>{
                        let pwValidity = resp.data

                    if(pwValidity.bool == true){
                        
                        sessionStorage.setItem("email", this.email);
                        window.location.href='index.html'

                    }else{
                        this.errors.push("Wrong password entered")
                    }
                    })
                }else{
                    count++
                }
            }
            
            //if count == no. of users in the database, means that the user email does not exist in database
            if(count== this.users.length){
                this.errors.push("Email has not been registered")
            } 
        },clearError(){
            this.errors=[]
        }
    }
})

app.component('error-alert', { 

    template: `<div class='alert alert-danger'>
                <strong>Error! </strong>
                <slot></slot>
                </div>`
});


app.mount("#app")