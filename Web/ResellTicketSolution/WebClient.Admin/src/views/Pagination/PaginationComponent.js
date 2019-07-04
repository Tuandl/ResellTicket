import React, { Component } from 'react';
import {
    Pagination, PaginationItem, PaginationLink,
} from 'reactstrap';

export default class PaginationView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            pageCount: 1,
            paginationItems: []
        }
    }

    componentWillReceiveProps(props) {
        var { currentPage, pageCount } = props
        for(let i = 0; i < this.state.paginationItems.length; i++) {
            this.state.paginationItems.splice(i, 1)
            i--;
        }
        this.setState({
            currentPage: props.currentPage,
            pageCount: props.pageCount
        })
        if (currentPage < 3) {
            for (let i = 1; i <= 5; i++) {
                if (i > pageCount) continue;
                this.state.paginationItems.push(i)
            }
        } else {
            for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                if (i > pageCount) continue;
                this.state.paginationItems.push(i)
            }
        }
    }

    goPage = (pageNumber) => {
        
        this.props.goPage(pageNumber)
    }

    render() {
        var { currentPage, paginationItems, pageCount } = this.state
        return (
            <Pagination>
                <PaginationItem disabled={currentPage === 1 ? true : false}>
                    <PaginationLink previous tag="button" onClick={() => this.goPage('prev')}>Prev</PaginationLink>
                </PaginationItem>
                {paginationItems.map((item, index) => {
                    return (
                        <PaginationItem key={index} active={currentPage === item ? true : false}>
                            <PaginationLink tag="button" onClick={() => this.goPage(item)}>{item}</PaginationLink>
                        </PaginationItem>
                    )
                })}
                <PaginationItem disabled={currentPage === pageCount ? true : false}>
                    <PaginationLink next tag="button" onClick={() => this.goPage('next')}>Next</PaginationLink>
                </PaginationItem>
            </Pagination>
        )
    }
}