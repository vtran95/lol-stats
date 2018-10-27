import React, {Component} from 'react';
import './SearchInput.css';
import matchInfoAPI from '../../utils/matchInfoAPI';
import {Input, Button, Preloader} from 'react-materialize';

class SearchInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sumName: '',
            showPreloader: false,
            invalidInput: false
        }
    }

    handleChange = (e) => {
        this.setState({
            sumName: e.target.value
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({showPreloader: true});
        matchInfoAPI.show(this.state.sumName)
        .then(matchHistory => {
            this.props.handleMatchHistory(matchHistory);
        }).then(() => {
            this.setState({showPreloader: false});
            this.props.history.push('/summoner/' + this.state.sumName);
        })
    }

    render() {
        return (
            <div>
                <form className='search-form' onSubmit={this.handleSubmit}>
                    <Input className='search-input' label='Enter Summoner Name' onChange={(e) => this.handleChange(e)}/>
                    <Button className='search-button' waves='light'>Search</Button>
                    { this.state.showPreloader && <Preloader className='preloader' size='small' /> }
                </form>
                {this.state.invalidInput && <p>Invalid input.</p>}
            </div>
        )
    }
}

export default SearchInput;