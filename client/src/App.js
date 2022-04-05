import React from "react";
import "./style.css";
import Web3 from "web3";
import SimpleStorageContract from "./contracts/SimpleStorage.json"
export default function App(){
    const [instance,setInstance] = React.useState();
    const [currAccount,setCurrAccount] = React.useState(null);
    const [ans,setAns] = React.useState(0);
    const connect = async ()=>{
      try{
        const web3 = await new Web3(window.ethereum)
        await window.ethereum.enable()
        const accounts = await web3.eth.getAccounts()
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = SimpleStorageContract.networks[networkId];
        setInstance(new web3.eth.Contract(
            SimpleStorageContract.abi,
            deployedNetwork && deployedNetwork.address,
        ))
        setCurrAccount(accounts[0])
        console.log(currAccount)
      }
      catch(err){
        console.log(err);
      }
    }
    const [ques,setQue] = React.useState([])
    const [selected,setSelected]= React.useState(0)
    const [count,setCount]= React.useState(0);
    const [start,setStart] = React.useState(false) 
    const correct = []
    React.useEffect(() => {
            fetch("https://opentdb.com/api.php?amount=5&category=18&type=multiple")
            .then(res => res.json())
            .then(data => setQue(data.results.map((element,index)=>{
                const temp_ques = {
                    id : index,
                    question : element.question
                }
                var answer_choices =[...element.incorrect_answers]
                answer_choices.push(element.correct_answer)
                answer_choices = shuffle(answer_choices)
                answer_choices.forEach((ele,ind) => {
                    temp_ques["choice"+ (ind+1)] = ele
                });
                temp_ques.answer = element.correct_answer
                for(let i=1;i<5;i++){
                    temp_ques["button"+i]=false;
                }
                temp_ques.isSelect = false
                
                return temp_ques
            })))
        }
    ,[]);
    
    function handleClick(id,colorChange,option){
        setQue(data => data.map(que =>{
            const temp = {...que}
            temp[colorChange]=true
            temp.isSelect = true
            if(!que.isSelect && que.id === id){
                if(option==que.answer){
                    setCount(prev => prev+1)
                }
                setSelected(prev => prev+1)
            }
            return !que.isSelect && que.id === id ? temp : que
        }))
    }
    console.log(count)
    console.log(ques)
    
    
    const print_ques = ques.map(data => {
        return (
            <div className="que">
            <h1>{data.question}</h1>
            <div className="options">
                <button style={{backgroundColor: data.button1 ? "#F190B7" : ""}} onClick={()=>handleClick(data.id,"button1",data.choice1)}>{data.choice1}</button>
                <button style={{backgroundColor: data.button2 ? "#F190B7" : ""}} onClick={()=>handleClick(data.id,"button2",data.choice2)}>{data.choice2}</button>
                <button style={{backgroundColor: data.button3 ? "#F190B7" : ""}} onClick={()=>handleClick(data.id,"button3",data.choice3)}>{data.choice3}</button>
                <button style={{backgroundColor: data.button4 ? "#F190B7" : ""}} onClick={()=>handleClick(data.id,"button4",data.choice4)}>{data.choice4}</button>
            </div>
            </div>
        )
    })
    function shuffle(array) {
        let currentIndex = array.length,  randomIndex;
        while (currentIndex != 0) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
      }
    const [valid,setValid] = React.useState(false)
    const validate = async () =>{
        if(selected==5){
            await instance.methods.set(count).send({ from: currAccount});
            await instance.methods.get().call().then(data =>{
                setAns(data);
                setValid(true);
            });
        }
        else{
            alert("Answer all Questions")
        }
    }
    return (
        
        <div className="main">
            <div className="connect">
                <h1>Web3 Quiz</h1>
                <button onClick={connect}>{currAccount==null ? "Connect Wallet" : "connected "+currAccount.slice(0,10)+"..."}</button>
            </div>
            { currAccount==null ? 
            <div className="start">
                <h1 >Connect to Wallet to Start The Quiz</h1>
            </div>
            :
            <div>
                <div className="ques_print">
                    {print_ques}
                </div>
                {valid && <div className="start"><h1>Scored {ans}</h1></div>}
                <div className="check">
                { !valid ?
                <button onClick={validate}>Check answers</button>
                :
                <button onClick={()=>{window.location.reload(false)}}>New game</button>
                }
                </div>
            </div>
            }
        </div>
    )
}