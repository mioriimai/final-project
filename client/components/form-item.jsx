import React from 'react';

export default class FormItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      originalImageUr: 'test',
      bgRemovedImageUrl: 'test',
      category: 'None',
      brand: 'None',
      color: 'None',
      notes: ''
    };
    this.handleNotesChange = this.handleNotesChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleNotesChange(event) {
    this.setState({
      notes: event.target.value
    });
  }

  handleSubmit(event) {
    // prevent the default form submission behavior.
    event.preventDefault();
    // reset the form.
    this.setState({
      originalImageUr: 'test',
      bgRemovedImageUrl: 'test',
      category: 'None',
      brand: 'None',
      color: 'None',
      notes: ''
    });
  }

  render() {
    // console.log(this.state);
    return (
      <form onSubmit={this.onSubmit}>
        <div className='form-item-container'>
          <div className='row'>
            <div className='column-full'>
              <p className='form-item-title'>{this.props.title}</p>
            </div>
          </div>
          <div className='row'>
            <div className='column-half'>
              <p className='upload-from-camera-roll'>Upload from Camera Roll</p>
            </div>

            <div className='column-half'>
              <div className='row each-row'>
                <div className='column-half'>
                  <p className='form-item-category'>Category</p>
                </div>
                <div className='column-half position-right'>
                  <select name="category" id="category">
                    <option value="none">None</option>
                    <option value="dresses">Dresses</option>
                    <option value="tops">Tops</option>
                  </select>
                </div>
              </div>

              <div className='row each-row'>
                <div className='column-half'>
                  <p className='form-item-brand'>Brand</p>
                </div>
                <div className='column-half position-right'>
                  <select name="brand" id="brand">
                    <option value="none">None</option>
                    <option value="dresses">Zara</option>
                    <option value="tops">H&M</option>
                  </select>
                </div>
              </div>

              <div className='row each-row'>
                <div className='column-half'>
                  <p className='form-item-color'>Color</p>
                </div>
                <div className='column-half position-right'>
                  <select name="color" id="color">
                    <option value="none">None</option>
                    <option value="dresses">White</option>
                    <option value="tops">Pink</option>
                  </select>
                </div>
              </div>
              <div className='row'>
                <label htmlFor="notes" className='form-item-notes'>Notes</label>
              </div>
              <div className='row'>
                <textarea name="notes" id="notes" value={this.state.notes} onChange={this.handleNotesChange} />
              </div>
              <div className='row item-save-button-wrapper'>
                <button className='item-save-button'>SAVE</button>
              </div>
            </div>
          </div>
        </div>
      </form>

    );
  }
}
