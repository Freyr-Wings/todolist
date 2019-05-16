import React from "react";
import style from "./pagination.module.scss";

// https://www.jianshu.com/p/37163fbf5b18
function PageItem(props){
    return (
        <li
            onClick = {props.clickPage}
            className = { props.curPage === props.pageNum ? style.active : "" }
        >
            {props.pageNum}
        </li>
    );
}


class Pagination extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            curPage: 1,
            groupFirstPage: 1,
        }
    }

    prevPage() {
        const pPage = this.state.curPage - 1;
        if(pPage > 0){
            this.changePageTo(pPage)
        }
    }

    nextPage() {
        const nPage = this.state.curPage + 1;
        if(nPage <= this.props.config.totalPageNum){
            this.changePageTo(nPage)
        }
    }

    changePageTo(page) {
        const groupFirstPage = this.state.groupFirstPage;
        const groupPageNum = this.props.config.groupPageNum;
        if(page < groupFirstPage || page >= groupFirstPage+groupPageNum){
            this.setState({
                curPage: page,
                groupFirstPage: Math.floor((page-1)/groupPageNum)*groupPageNum+1,
            })
        }
        else{
            this.setState({
                curPage: page,
            })
        }
        this.props.config.handlePageChange(page);
    }

    createPageItems(i){
        return (
            <PageItem
                curPage={this.state.curPage}
                clickPage={() => this.changePageTo(i)}
                pageNum={i}
                key={i}
            />
        )
    }

    create(){
        const totalPageNum = this.props.config.totalPageNum;
        const groupPageNum = this.props.config.groupPageNum;
        const showFullPagesLimit = this.props.config.showFullPagesLimit;

        let pages = [];

        pages.push(
            <li
                onClick={() => {this.prevPage()}}
                key={0}
                className={this.state.curPage <= 1? style.nomore: ""}
            >
                &lt;
            </li>
        );
        if(totalPageNum <= showFullPagesLimit){
            for(let i = 1;i <= totalPageNum; i++){
                pages.push(
                    this.createPageItems(i)
                )
            }
        }
        else{
            let i = this.state.groupFirstPage;
            for(let j = 1;i <= totalPageNum && j <= groupPageNum; i++, j++){
                pages.push(
                    this.createPageItems(i)
                )
            }

            if(i < totalPageNum-2){
                pages.push(<li className = { style.ellipsis } key={-1}>···</li>);
                pages.push(this.createPageItems(totalPageNum-1));
                pages.push(this.createPageItems(totalPageNum));
            }
        }


        pages.push(
            <li
                onClick={() => {this.nextPage()}}
                key={totalPageNum+1}
                className={this.state.curPage >= totalPageNum? style.nomore: ""}
            >
                &gt;
            </li>
        );

        return pages;
    }

    render(){
        let pages = this.create();
        return(
            <div className = { style.main }>
                <ul  className = { style.page }>
                    {pages}
                </ul>
            </div>
        );
    }
}


export default Pagination