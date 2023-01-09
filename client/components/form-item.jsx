import React from 'react';

export default class FormItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      originalImage: '',
      bgRemovedImage: 'None',
      category: 'None',
      brand: 'None',
      color: 'None',
      notes: '',
      preview: null,
      saved: false
    };

    this.fileInputRef = React.createRef();
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleBrandChange = this.handleBrandChange.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.handleNotesChange = this.handleNotesChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePopupClick = this.handlePopupClick.bind(this);

    this.categoryOptions = ['None', 'Dress', 'Tops & blouses', 'Sweaters', 'Jeans', 'Pants', 'Skirts', 'Coats & jacktes', 'Athletic apparel', 'Swimwear', 'Handbags', 'Accessories', 'Jewelry', 'Shoes'];
    this.brandOptions = ['None', 'Adidas', 'Birkenstocks', 'Chanel', 'Christian Dior', 'Gap', 'Gucci', 'H&M', 'Hermes', 'Lacoste', 'Louis Vuitton', 'Lululemon', 'Moncler', 'Nike', 'Polo Ralph Lauren', 'The North Face', 'Uniqlo', 'Urban Outfitters', 'Zara'];
    this.colorOptions = ['None', 'Black', 'Grey', 'White', 'Beige', 'Red', 'Pink', 'Purple', 'Navy', 'Blue', 'Green', 'Yellow', 'Orange', 'Brown', 'Gold', 'Silver'];
    this.createOptions = this.createOptions.bind(this);
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
      originalImage: event.target.files[0].name
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

    // Create a `new` FormData object.
    const formDataObject = new FormData();

    //  Append entries to the form data object I created.
    formDataObject.append('originalImage', this.fileInputRef.current.files[0]);
    formDataObject.append('bgRemovedImage', this.state.bgRemovedImage);
    formDataObject.append('category', this.state.category);
    formDataObject.append('brand', this.state.brand);
    formDataObject.append('color', this.state.color);
    formDataObject.append('notes', this.state.notes);
    formDataObject.append('isFavorite', false);
    formDataObject.append('userId', 1);

    // Use fetch() to send a POST request to / api / form-item.
    fetch('/api/form-item', {
      method: 'POST',
      body: formDataObject
    })
      .then(res => res.json())
      .then(data => {
        this.setState({
          originalImage: '',
          bgRemovedImage: 'None',
          category: 'None',
          brand: 'None',
          color: 'None',
          notes: '',
          preview: null,
          saved: true
        });
        this.fileInputRef.current.value = null;

      })
      .catch(err => console.error(err));
  }

  handlePopupClick() {
    this.setState({
      saved: !this.state.saved
    });
  }

  createOptions(array) {
    const optionList = [];
    for (let i = 0; i < array.length; i++) {
      optionList.push(<option key={i} value={array[i]}>{array[i]}</option>);
    }
    return optionList;
  }

  render() {
    // show image placeholder and hide it when image is selected
    const previewImage = this.state.preview;
    let preview = '';
    let placeholderClassName = 'item-image-placeholder';
    let uploadMessage = 'upload-from-camera-roll';
    if (previewImage != null) {
      preview = (
        <img src={previewImage} className='chosen-image' />
      );
      placeholderClassName = 'item-image-placeholder hidden';
      uploadMessage = 'upload-from-camera-roll hidden';
    }

    // popup-window
    const popup = this.state.saved ? 'pop-up' : 'pop-up hidden';

    return (
      <>
        <form onSubmit={this.handleSubmit}>
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
                  <p className={uploadMessage}>Upload from Camera Roll</p>
                  {preview}
                </div>
                <div className='row file-upload-wrapper'>
                  <input required type="file" name='originalImage' ref={this.fileInputRef} accept=".png, .jpg, .jpeg, .gif" onChange={this.handleImageUpload} className='choose-file' />
                </div>
              </div>
              <div className='column-half'>
                <div className='row each-row'>
                  <div className='column-two-fifth'>
                    <p className='form-item-category'>Category</p>
                  </div>
                  <div className='column-three-fifth position-right'>
                    <select name="category" id="category" value={this.state.category} onChange={this.handleCategoryChange}>
                      {this.createOptions(this.categoryOptions)}
                    </select>
                  </div>
                </div>
                <div className='row each-row'>
                  <div className='column-three-ten'>
                    <p className='form-item-brand'>Brand</p>
                  </div>
                  <div className='column-seven-ten position-right'>
                    <select name="brand" id="brand" value={this.state.brand} onChange={this.handleBrandChange}>
                      {this.createOptions(this.brandOptions)}
                    </select>
                  </div>
                </div>
                <div className='row each-row'>
                  <div className='column-three-ten'>
                    <p className='form-item-color'>Color</p>
                  </div>
                  <div className='column-seven-ten position-right'>
                    <select name="color" id="color" value={this.state.color} onChange={this.handleColorChange}>
                      {this.createOptions(this.colorOptions)}
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
                  <button type='submit' className='item-save-button'>SAVE</button>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className={popup}>
          <div className='popup-text-wrapper'>
            <h1 className='successfully-saved'>Successfully saved!</h1>
            <a className='add-more-items' href='#add-item' onClick={this.handlePopupClick}>Add More Items</a>
            <br />
            <a className='see-items' href='#items' onClick={this.handlePopupClick}>See Items in the Closet</a>
          </div>
        </div>
      </>
    );
  }
}
