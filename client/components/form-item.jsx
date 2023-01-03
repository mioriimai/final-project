import React from 'react';

export default class FormItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: 'None'
    };
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
  }

  handleCategoryChange(event) {
    this.setState({
      category: event.target.value
    });
  }

  render() {
    return (
      <div className='form-item-wrapper'>
        <h1>{this.props.title}</h1>
        <form>
          <input
            type="text"
            name="category"
            value={this.state.category}
            onChange={this.handleCategoryChange} />
        </form>
      </div>
    );
  }
}
