import React from 'react';
import CreateOptions from './create-options';

export default class EditItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: null,
      preview: null,
      updatedOriginalImage: '',
      updatedBgRemovedImage: 'None',
      updatedCategory: '',
      updatedBrand: '',
      updatedColor: '',
      updatedNotes: ''
    };

    this.fileInputRef = React.createRef();
    this.handleImageUpload = this.handleImageUpload.bind(this);
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

    // this.setState({
    //   originalImage: event.target.files[0].name
    // });
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

    return (

      <form>
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
                  <select name="category" id="category" value={category} /*  onChange={this.handleCategoryChange} */>
                    <CreateOptions options="category" />
                  </select>
                </div>
              </div>
              <div className='row each-row'>
                <div className='column-three-ten'>
                  <p className='form-item-brand'>Brand</p>
                </div>
                <div className='column-seven-ten position-right'>
                  <select name="brand" id="brand" value={brand} /* onChange={this.handleBrandChange} */>
                    <CreateOptions options="brand" />
                  </select>
                </div>
              </div>
              <div className='row each-row'>
                <div className='column-three-ten'>
                  <p className='form-item-color'>Color</p>
                </div>
                <div className='column-seven-ten position-right'>
                  <select name="color" id="color" value={color} /* onChange={this.handleColorChange} */>
                    <CreateOptions options="color" />
                  </select>
                </div>
              </div>
              <div className='row'>
                <label htmlFor="notes" className='form-item-notes'>Notes</label>
              </div>
              <div className='row'>
                <textarea name="notes" id="notes" value={notes} /* onChange={this.handleNotesChange} / */ />
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
