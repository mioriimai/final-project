import React from 'react';

export default class CreateOptions extends React.Component {
  constructor(props) {
    super(props);

    this.categoryOptions = ['None', 'Dress', 'Tops & blouses', 'Sweaters', 'Jeans', 'Pants', 'Skirts', 'Coats & jacktes', 'Athletic apparel', 'Swimwear', 'Handbags', 'Accessories', 'Jewelry', 'Shoes'];
    this.brandOptions = ['None', 'Adidas', 'Birkenstocks', 'Chanel', 'Christian Dior', 'Gap', 'Gucci', 'H&M', 'Hermes', 'Lacoste', 'Louis Vuitton', 'Lululemon', 'Moncler', 'Nike', 'Polo Ralph Lauren', 'The North Face', 'Uniqlo', 'Urban Outfitters', 'Zara'];
    this.colorOptions = ['None', 'Black', 'Grey', 'White', 'Beige', 'Red', 'Pink', 'Purple', 'Navy', 'Blue', 'Green', 'Yellow', 'Orange', 'Brown', 'Gold', 'Silver'];
    this.sortCategoryOptions = ['Category', 'None', 'Dress', 'Tops & blouses', 'Sweaters', 'Jeans', 'Pants', 'Skirts', 'Coats & jacktes', 'Athletic apparel', 'Swimwear', 'Handbags', 'Accessories', 'Jewelry', 'Shoes'];
    this.sortBrandOptions = ['Brand', 'None', 'Adidas', 'Birkenstocks', 'Chanel', 'Christian Dior', 'Gap', 'Gucci', 'H&M', 'Hermes', 'Lacoste', 'Louis Vuitton', 'Lululemon', 'Moncler', 'Nike', 'Polo Ralph Lauren', 'The North Face', 'Uniqlo', 'Urban Outfitters', 'Zara'];
    this.sortColorOptions = ['Color', 'None', 'Black', 'Grey', 'White', 'Beige', 'Red', 'Pink', 'Purple', 'Navy', 'Blue', 'Green', 'Yellow', 'Orange', 'Brown', 'Gold', 'Silver'];
    this.createOptions = this.createOptions.bind(this);
  }

  createOptions(array) {
    const optionList = [];
    for (let i = 0; i < array.length; i++) {
      optionList.push(<option key={i} value={array[i]} >{array[i]}</option>);
    }
    return optionList;
  }

  render() {
    let optionsArray = null;
    if (this.props.options === 'category' && this.props.usage) {
      optionsArray = this.sortCategoryOptions;
    } else if (this.props.options === 'category' && !this.props.usage) {
      optionsArray = this.categoryOptions;
    }

    if (this.props.options === 'brand' && this.props.usage) {
      optionsArray = this.sortBrandOptions;
    } else if (this.props.options === 'brand' && !this.props.usage) {
      optionsArray = this.brandOptions;
    }
    if (this.props.options === 'color' && this.props.usage) {
      optionsArray = this.sortColorOptions;
    } else if (this.props.options === 'color' && !this.props.usage) {
      optionsArray = this.colorOptions;
    }

    return (
      this.createOptions(optionsArray)
    );
  }
}
