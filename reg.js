
    const app1= Vue.createApp({
        data(){
            return{
                height:"",
                weight:"",
                cutOrBulk:'',
                name:'',
                email:'',
                password:'',
                cnfmPassword:'',
                error:'',
                users:[],
                successfulReg:'',
                
            }
        },async created(){
            const resp= await axios.get("https://dcsibh9m73.execute-api.ap-southeast-1.amazonaws.com/prod/retrieveUsers.php")
            resp.data.forEach((each)=>{
                const eachObj = JSON.parse(each) //convert strings to JSON objs
        
                const userEmailnPW={
                    'email': eachObj.email,
                    'password':  eachObj.password,
                    
                }
                this.users.push(userEmailnPW)
            })
                
                        
                    
                    
        },
        
        methods:{
            getBMI(){
                let heightSquare = (parseFloat(this.height)/100)**2
           
                return (parseFloat(this.weight)/heightSquare).toFixed(2)
            }, 
            register(){
                    this.error=""
                    if(this.email=="" || this.height=="" || this.weight=="" || this.password=="" ||this.cnfmPassword=="" || this.cutOrBulk==""){

                        this.error+="Registration Form is incomplete. Please fill in every field <br>"
                    }
            
                    this.users.forEach((u)=>{
                        if(u.email == this.email){
                        this.error+='There is an account registered under this email already! <br>'
                                                    
                    }})
                        

                    if(this.password!= this.cnfmPassword){
                        this.error+="The password and Confirmed Password fields do not match! Please re-enter the same password at the Confirmed Password field. <br>"

                    }
                    console.log(this.email.indexOf("@"))
                    if(this.email.indexOf("@")==-1){
                        this.error+="Invalid email format! Email must contain '@' <br>"
                    }
                    
                    if(this.error.length==0){
                        let params={email: this.email, password: this.password, height: this.height, name: this.name, weight: this.weight, cutOrBulk: this.cutOrBulk}
                        axios.post("https://dcsibh9m73.execute-api.ap-southeast-1.amazonaws.com/prod/newUser.php",params)
                        .then(response=>{
                            this.successfulReg="You have successfully registered!"
                            console.log("You have successfully registered")
                            sessionStorage.setItem('email',this.email)
                            sessionStorage.setItem('type', this.cutOrBulk)
                            window.location.href='index.html'
                        }).catch(err =>{
                            console.log("ERROR: " + err.message)
                        })  
                    }
                    
        
                
                },
    
            }
      
    
})
app1.component('alert-box',{
    template:`<div class='alert alert-danger'><strong>Error! </strong><slot></slot></div>`
}) 
app1.component('success',{
    template:`<div class='alert alert-success'></strong><slot></slot></div>`
})
app1.mount('#app')