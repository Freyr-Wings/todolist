import React,{ Component } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

function ItemContent(props) {
    if(props.editMode){
        return(
            <div>
                <input
                    type="text"
                    defaultValue={props.content}
                    onChange={(e) => props.handleChangeContent(e.target.value)}
                />
            </div>
        )
    }
    else{
        return(
            <div>{props.content}</div>
        )
    }
}

function ItemDate(props) {
    if(props.editMode){
        return(
            <div>截止时间：
                <DatePicker
                    dateFormat="yyyy/MM/dd"
                    selected={props.endDate}
                    minDate={new Date()}
                    selectsEnd
                    startDate={props.startDate}
                    endDate={props.endDate}
                    onChange={(date) => props.handleChangeEnd(date)}
                />
            </div>
        )
    }
    else{
        return(
            <div>计划时间：{props.startDate.toLocaleDateString()} ~ {props.endDate.toLocaleDateString()}</div>
        )
    }
}

function ItemPriority(props) {
    if(props.editMode){
        let options = [];
        for (let i = 0; i <= 9; i++) {
            options.push(<option key={i} value={i}>{i}</option>)
        }
        return(
            <div>优先级：
                <select
                    defaultValue={props.priority}
                    onChange={(e) => props.handleChangePriority(e.target.value)}
                >
                    {options}
                </select>
            </div>
        )
    }
    else{
        return(
            <div>优先级：{props.priority}</div>
        )
    }
}

function ButtonGroups(props) {
    let buttons = [];
    if(props.editMode){
        buttons.push(<button onClick={() => props.changeItem()} key={1}>确认</button>);
        buttons.push(<button onClick={() => props.resetData()} key={2}>返回</button>);
    }
    else{
        if(!props.finished){
            buttons.push(<button onClick={() => props.finishItem()} key={3}>完成</button>)
        }
        buttons.push(<button onClick={() => props.toggleEditMode()} key={4}>编辑</button>);
        buttons.push(<button onClick={() => props.deleteItem()} key={5}>删除</button>);
    }
    return(
        <div>
            {buttons}
        </div>
    )
}

class ItemConstructor extends Component{
    constructor(props){
        super(props);

        this.state = {
            content: "",
            startDate: new Date(),
            endDate: new Date(),
            priority: 0,
        }
    }

    handleChangeContent(content){
        this.setState({
            content: content,
        })
    }

    handleChangeEnd(date){
        this.setState({
            endDate:date,
        })
    }

    handleChangePriority(priority){
        this.setState({
            priority: priority
        })
    }

    resetData(){
        this.setState({
            content: "",
            startDate: new Date(),
            endDate: new Date(),
            priority: 0,
        });
    }

    addItem(){
        let newItem = {
            "content": this.state.content,
            "end_time": this.state.endDate.toLocaleDateString(),
            "priority": this.state.priority,
            "finished": false
        };

        fetch('http://localhost:8000/todolist/items/', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'post',
            body: JSON.stringify(newItem)
        }).then((response) => {
            if(response.status !== 201){
                alert("请求失败！");
                throw Error("请求失败！");
            }
        }).then(
            () => {
                this.resetData();
                this.props.refreshPage();
            }
            // (data) => console.log(data)
        ).catch(console.log);
    }

    render(){
        let options = [];
        for (let i = 0; i <= 9; i++) {
            options.push(<option key={i} value={i}>{i}</option>)
        }
        return(
            <div className="card">
                <div className="card-header"/>
                <div className="card-body">
                    <ItemContent
                        editMode={true}
                        content={this.state.content}
                        handleChangeContent={(content) => this.handleChangeContent(content)}
                    />
                    <ItemDate
                        editMode={true}
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                        handleChangeEnd={(date) => this.handleChangeEnd(date)}
                    />
                    <ItemPriority
                        editMode={true}
                        priority={this.state.priority}
                        handleChangePriority={(p) => this.handleChangePriority(p)}
                    />
                </div>
                <div className="card-footer bg-white">

                    <button onClick={() => this.addItem()}>新建事项</button>

                </div>
            </div>
        )
    }
}

function ItemHeader(props) {
    let itemStatus = props.itemStatus;
    if(itemStatus === 0){
        return(
            <div className="card-header bg-info">
                赶DDL中...
            </div>
        )
    }
    else if(itemStatus > 0){
        return(
            <div className="card-header bg-success">
                已完成O(∩_∩)O
            </div>
        )
    }
    else{
        return(
            <div className="card-header bg-warning">
                已过期TAT
            </div>
        )
    }

}


class Item extends Component{
    constructor(props){
        super(props);

        this.state = {
            editMode: false,
            curContent: props.content,
            curStartDate: new Date(props.startTime),
            curEndDate: new Date(props.endTime),
            curPriority: props.priority,
            finished: props.finished,

            content: props.content,
            endDate: new Date(props.endTime),
            priority: props.priority,
        }

    }

    computeItemStatus(endTime, finished){
        if(finished){
            return 1
        }
        else{
            if(endTime >= new Date()){
                return 0
            }
            else{
                return -1
            }
        }
    }

    handleChangeContent(content){
        this.setState({
            content: content,
        })
    }

    handleChangeEnd(date){
        this.setState({
            endDate:date,
        })
    }

    handleChangePriority(priority){
        this.setState({
            priority: priority
        })
    }

    resetData(){
        this.setState({
            editMode: false,
            content: this.state.curContent,
            endDate: this.state.curEndDate,
            priority: this.state.curPriority
        });
    }

    toggleEditMode(){
        this.setState({
            editMode: !this.state.editMode
        })
    }

    deleteItem() {
        fetch('http://localhost:8000/todolist/items/' + this.props.id + '/', {
            method: 'delete',
        }).then(function(response) {
            if(response.status !== 204){
                alert("请求失败！");
                throw Error("请求失败！");
            }
        }).then(
            () => this.props.refreshPage()
        ).catch(console.log);
    }

    changeItem() {
        let newItem = {
            "content": this.state.content,
            "end_time": this.state.endDate.toLocaleDateString(),
            "priority": this.state.priority
        };

        fetch('http://localhost:8000/todolist/items/' + this.props.id + '/', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'put',
            body: JSON.stringify(newItem)
        }).then(function(response) {
            if(response.status !== 200){
                alert("请求失败！");
                throw Error("请求失败！");
            }
            return response.json();
        }).then((data) => {
            // console.log(data);
            this.setState({
                editMode: false,
                curContent: data["content"],
                curEndDate: new Date(data["end_time"]),
                curPriority: data["priority"],
                finished: data["finished"],

                content: data["content"],
                endDate: new Date(data["end_time"]),
                priority: data["priority"],
            });
        }).catch(console.log);
    }

    finishItem(){
        let reqBody = {
            "finished": true
        };

        fetch('http://localhost:8000/todolist/items/' + this.props.id + '/', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'patch',
            body: JSON.stringify(reqBody)
        }).then(function(response) {
            if(response.status !== 200){
                alert("请求失败！");
                throw Error("请求失败！");
            }
            // return response.json();
        }).then(() => {
            // console.log(data);
            this.setState({
                editMode: false,
                finished: true,
            });
        }).catch(console.log);
    }


    render() {
        return (
            <div className="card">
                <ItemHeader
                    itemStatus={this.computeItemStatus(this.state.curEndDate, this.state.finished)}
                />
                <div className="card-body">
                    <ItemContent
                        editMode={this.state.editMode}
                        content={this.state.curContent}
                        handleChangeContent={(content) => this.handleChangeContent(content)}
                    />
                    <ItemDate
                        editMode={this.state.editMode}
                        startDate={this.state.curStartDate}
                        endDate={this.state.endDate}
                        handleChangeEnd={(date) => this.handleChangeEnd(date)}
                    />
                    <ItemPriority
                        editMode={this.state.editMode}
                        priority={this.state.curPriority}
                        handleChangePriority={(p) => this.handleChangePriority(p)}
                    />
                    {/*<div className="progress">*/}
                        {/*<div className="progress-bar bg-primary"/>*/}
                    {/*</div>*/}
                </div>
                <div className="card-footer bg-white">

                    <ButtonGroups
                        editMode={this.state.editMode}
                        finished={this.state.finished}
                        finishItem={() => this.finishItem()}
                        toggleEditMode={() => this.toggleEditMode()}
                        resetData={() => this.resetData()}
                        changeItem={() => this.changeItem()}
                        deleteItem={() => this.deleteItem()}
                    />

                </div>
            </div>
        );
    }
}


class Items extends Component{

    render() {
        let items = this.props.contacts;
        return (

            <div>

                <ItemConstructor
                    refreshPage={() => this.props.refreshPage(this.props.order)}
                />
                {items.map((item) => (
                    <Item
                        key={item["id"]}
                        id={item["id"]}
                        content={item["content"]}
                        startTime={item["start_time"]}
                        endTime={item["end_time"]}
                        priority={item["priority"]}
                        finished={item["finished"]}
                        refreshPage={() => this.props.refreshPage(this.props.order)}
                    />
                ))}
            </div>
        )
    }
}

export default Items