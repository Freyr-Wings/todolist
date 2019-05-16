import React from 'react'
import Pagination from "./Pagination";
import Items from "./Items"

class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            totalPageNum: 1,
            items: [],
            order: 3,
            curPage: 1,
        }
    }

    getPageInfo(page) {
        console.log("curpage: " + this.state.curPage);
        console.log('http://localhost:8000/todolist/items/?page='+page+'&order='+this.state.order);
        fetch('http://localhost:8000/todolist/items/?page='+page+'&order='+this.state.order)
            .then(res => res.json())
            .then((data) => {
                this.setState({
                    totalPageNum: data["total_pages"],
                    items: data["results"]
                });
                console.log(data["results"])
            })
            .catch(console.log);
    }

    changeOrder(order){
        console.log("change order to: " + order);
        this.setState({
            order: order
        }, () => (this.getPageInfo(this.state.curPage)));

    }

    componentDidMount() {
        this.getPageInfo(1, this.state.order)
    }

    render(){
        return(
            <div className="container">
                <h1 style={{textAlign: 'center'}}>Todo List</h1>
                <div>优先级：
                    <select
                        defaultValue={this.state.order}
                        onChange={(e) => this.changeOrder(e.target.value)}
                    >
                        <option key={1} value={1}>优先级（从低到高）</option>
                        <option key={2} value={2}>优先级（从高到低）</option>
                        <option key={3} value={3}>最新</option>
                        <option key={4} value={4}>最旧</option>
                        <option key={5} value={5}>截止日期</option>
                    </select>
                </div>
                <Items
                    contacts={this.state.items}
                    refreshPage={() => this.getPageInfo(this.state.curPage)}
                />

                <Pagination config = {{
                    showFullPagesLimit:10,
                    totalPageNum:this.state.totalPageNum,
                    groupPageNum:7,
                    handlePageChange:page => {
                        this.setState({
                            curPage: page
                        }, () => this.getPageInfo(page))
                    },
                }}/>
            </div>
        );
    }
}

export default App