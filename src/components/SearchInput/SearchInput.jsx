import React, {Component} from 'react';
import './SearchInput.css';
import matchInfoAPI from '../../utils/matchInfoAPI';
import {Input, Button} from 'react-materialize';

class SearchInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sumName: ''
        }
    }

    handleChange = (e) => {
        this.setState({
            sumName: e.target.value
        });
    }

    handleSubmit = (e) => {
        // e.preventDefault();
        matchInfoAPI.show(this.state.sumName);
    }

    render() {
        return (
            <form className='search-form' onSubmit={this.handleSubmit}>
                <Input className='search-input' label='Enter Summoner Name' onChange={(e) => this.handleChange(e)}/>
                <Button className='search-button' waves='light'>Search</Button>
            </form>
        )
    }
}

export default SearchInput;