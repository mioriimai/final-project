import React from 'react';
// import Create from '../components/file-upload';

export default class FormItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      originalImageUrl: '',
      bgRemovedImageUrl: 'test',
      category: 'none',
      brand: 'none',
      color: 'none',
      notes: '',
      preview: null
    };
    this.fileInputRef = React.createRef();
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleBrandChange = this.handleBrandChange.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.handleNotesChange = this.handleNotesChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleImageChange(event) {

    const files = event.target.files;
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = event => {
        this.setState({ preview: event.target.result });
      };
      reader.readAsDataURL(file);
    } else {
      this.setState({ preview: null });
    }
    // this.setState({
    //   originalImageUrl: window.URL.createObjectURL(event.target.files[0])
    // });
    this.setState({
      originalImageUrl: event.target.files[0].name
    });

  }

  handleCategoryChange(event) {
    this.setState({
      category: event.target.value
    });
  }

  handleBrandChange(event) {
    this.setState({
      brand: event.target.value
    });
  }

  handleColorChange(event) {
    this.setState({
      color: event.target.value
    });
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

    const previewImage = this.state.preview;
    let preview = '';
    let placeholderClassName = 'item-image-placeholder';
    let uploadMessage = 'Upload from Camera Roll';
    if (previewImage != null) {
      preview = (

        <img src={previewImage} className='chosen-image' />

      );
      placeholderClassName = 'item-image-placeholder hidden';
      uploadMessage = '';
    }

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
              <div className='row  item-image-wrapper'>
                <img src="/images/image-placeholder.png" alt="placeholder" className={placeholderClassName}/>
                <p className='upload-from-camera-roll'>{uploadMessage}</p>
                {/* file upload */}
                {preview}
              </div>
              <div className='row'>
                <input required type="file" name='image' ref={this.fileInputRef} accept=".png, .jpg, .jpeg, .gif" onChange={this.handleImageChange} className='choose-file' />
              </div>
            </div>

            <div className='column-half'>
              <div className='row each-row'>
                <div className='column-half'>
                  <p className='form-item-category'>Category</p>
                </div>
                <div className='column-half position-right'>
                  <select name="category" id="category" value={this.state.value} onChange={this.handleCategoryChange}>
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
                  <select name="brand" id="brand" value={this.state.value} onChange={this.handleBrandChange}>
                    <option value="none">None</option>
                    <option value="zara">Zara</option>
                    <option value="h&m">H&M</option>
                  </select>
                </div>
              </div>

              <div className='row each-row'>
                <div className='column-half'>
                  <p className='form-item-color'>Color</p>
                </div>
                <div className='column-half position-right'>
                  <select name="color" id="color" value={this.state.value} onChange={this.handleColorChange}>
                    <option value="none">None</option>
                    <option value="white">White</option>
                    <option value="pink">Pink</option>
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
