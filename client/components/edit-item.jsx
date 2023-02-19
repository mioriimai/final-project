import React from 'react';
import CreateOptions from './create-options';

export default class EditItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: null,
      preview: null,
      updatedOriginalImage: null,
      updatedBgRemovedImage: 'None',
      updatedCategory: null,
      updatedBrand: null,
      updatedColor: null,
      updatedNotes: null
    };

    this.fileInputRef = React.createRef();
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleBrandChange = this.handleBrandChange.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.handleNotesChange = this.handleNotesChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    fetch(`/api/items/${this.props.itemId}`)
      .then(res => res.json())
      .then(item => this.setState({ item }));
  }

  handleImageUpload(event) {
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

    this.setState({
      updatedOriginalImage: event.target.files[0].name
    });
  }

  handleCategoryChange(event) {
    this.setState({
      updatedCategory: event.target.value
    });
  }

  handleBrandChange(event) {
    this.setState({
      updatedBrand: event.target.value
    });
  }

  handleColorChange(event) {
    this.setState({
      updatedColor: event.target.value
    });
  }

  handleNotesChange(event) {
    this.setState({
      updatedNotes: event.target.value
    });
  }

  handleSubmit(event) {
    // prevent the default form submission behavior.
    event.preventDefault();

    // Create a `new` FormData object.
    const formDataObject = new FormData();

    //  Append entries to the form data object I created.
    formDataObject.append('originalImage', this.fileInputRef.current.files[0]);
    formDataObject.append('bgRemovedImage', this.state.updatedBgRemovedImage);
    formDataObject.append('category', this.state.updatedCategory);
    formDataObject.append('brand', this.state.updatedBrand);
    formDataObject.append('color', this.state.updatedColor);
    formDataObject.append('notes', this.state.updatedNotes);
    formDataObject.append('userId', 1);

    // Use fetch() to send a POST request to / api / form-item.
    fetch(`/api/items/${this.props.itemId}`, {
      method: 'PATCH',
      body: formDataObject
    })
      .then(res => res.json())
      .then(data => {
        this.setState({

        });
        this.fileInputRef.current.value = null;

      })
      .catch(err => console.error(err));
  }

  render() {
    // console.log('this.state:', this.state);
    if (!this.state.item) return null;

    const { originalImage, category, brand, color, notes, itemId } = this.state.item;

    const previewImage = this.state.preview;
    let preview = '';
    let showedImageClassName = 'chosen-image';
    if (previewImage != null) {
      preview = (
        <img src={previewImage} className='chosen-image' />
      );
      showedImageClassName = 'chosen-image hidden';
    }

    let valueOfCategory = category;
    if (this.state.updatedCategory !== null) {
      valueOfCategory = this.state.updatedCategory;
    }

    let valueOfBrand = brand;
    if (this.state.updatedBrand !== null) {
      valueOfBrand = this.state.updatedBrand;
    }

    let valueOfColor = color;
    if (this.state.updatedColor !== null) {
      valueOfColor = this.state.updatedColor;
    }

    let valueOfNotes = notes;
    if (this.state.updatedNotes !== null) {
      valueOfNotes = this.state.updatedNotes;
    }

    return (

      <form onSubmit={this.handleSubmit}>
        <div className='form-item-container'>
          <div className='row'>
            <div className='column-full'>
              <p className='form-item-title'>Edit Item</p>
            </div>
          </div>
          <div className='row'>
            <div className='column-half add-padding-left'>
              <div className='row item-image-wrapper'>
                <img src={ originalImage } alt={ itemId } className={showedImageClassName} />
                {preview}
              </div>
              <div className='row file-upload-wrapper'>
                <input required type="file" name='originalImage' ref={this.fileInputRef} accept=".png, .jpg, .jpeg, .gif" onChange={this.handleImageUpload} className='choose-file' />
              </div>
            </div>
            <div className='column-half add-padding-right'>
              <div className='row each-row'>
                <div className='column-two-fifth'>
                  <p className='form-item-category'>Category</p>
                </div>
                <div className='column-three-fifth position-right'>
                  <select name="category" id="category" value={valueOfCategory} onChange={this.handleCategoryChange} >
                    <CreateOptions options="category" />
                  </select>
                </div>
              </div>
              <div className='row each-row'>
                <div className='column-three-ten'>
                  <p className='form-item-brand'>Brand</p>
                </div>
                <div className='column-seven-ten position-right'>
                  <select name="brand" id="brand" value={valueOfBrand} onChange={this.handleBrandChange} >
                    <CreateOptions options="brand" />
                  </select>
                </div>
              </div>
              <div className='row each-row'>
                <div className='column-three-ten'>
                  <p className='form-item-color'>Color</p>
                </div>
                <div className='column-seven-ten position-right'>
                  <select name="color" id="color" value={valueOfColor} onChange={this.handleColorChange} >
                    <CreateOptions options="color" />
                  </select>
                </div>
              </div>
              <div className='row'>
                <label htmlFor="notes" className='form-item-notes'>Notes</label>
              </div>
              <div className='row'>
                <textarea name="notes" id="notes" value={valueOfNotes} onChange={this.handleNotesChange} />
              </div>
              <div className='row item-save-button-wrapper'>
                <button type='submit' className='item-save-button'>SAVE</button>
              </div>
            </div>
          </div>
        </div>
      </form>

    );
  }
}
