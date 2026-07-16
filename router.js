const { emailAgent, confirmEmail } = require("./emailAgent");
const { mainAgent } = require("./mainAgent");

let currentAgent = "MAIN";

async function route(input){

    if(currentAgent==="MAIN"){

        if(input.toLowerCase().includes("email")){

            currentAgent="EMAIL";

            return await emailAgent(input);

        }

        return await mainAgent(input);

    }

    if(currentAgent==="EMAIL"){

        const result=confirmEmail(input);

        if(result.status==="APPROVED"){

            currentAgent="MAIN";

            return{

                message:"Email approved.\nReturning control to Main Agent.",

                email:result.email

            }

        }

        currentAgent="MAIN";

        return{

            message:"Email rejected. Returning to Main Agent."

        }

    }

}

module.exports={route}