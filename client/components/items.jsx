import React from 'react';

export default class Items extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      showNotes: false,
      itemId: null
    };
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  componentDidMount() {
    fetch('/api/items')
      .then(res => res.json())
      .then(items => this.setState({ items }));
  }

  handleMouseEnter(event) {
    this.setState({
      // showNotes: true
      itemId: event.target.title
    });
  }

  handleMouseLeave() {
    this.setState({
      // showNotes: false
      itemId: null
    });
  }

  render() {

    // console.log(this.state);

    const itemsArray = [];
    for (let i = 0; i < this.state.items.length; i++) {
      itemsArray.push(
        <div key={i} className="item-wrapper">
          <Item
          item={this.state.items[i]}
          handleMouseEnter={this.handleMouseEnter}
          handleMouseLeave={this.handleMouseLeave}
          hoverClassName={
            i === this.state.itemId ? 'shadow-wrapper' : 'shadow-wrapper hidden'
          }/>
        </div>
      );
    }
    // const hoverClassName = this.state.showNotes ? 'shadow-wrapper' : 'shadow-wrapper hidden';
    return (
      <div className='items-container'>
        <p className='items'>{this.props.content}</p>
        <a href="#add-item" className='add-items-button'>Add {this.props.content}</a>

        <div className='item-list-wrapper'>
          {itemsArray}
          {/* {
            this.state.items.map(item => (
              <div key={item.itemId} className="item-wrapper">
                <Item
                  item={item}
                  handleMouseEnter={this.handleMouseEnter}
                  handleMouseLeave={this.handleMouseLeave}
                  hoverClassName={hoverClassName}/>
              </div>
            ))
          } */}
        </div>
      </div>
    );
  }
}

function Item(props) {
  const { originalImage, notes, itemId } = props.item;
  // console.log('props.item.originalImage:', props.item.originalImage);
  // console.log('originalimage:', originalImage);

  return (
    <a href={`#items?itemId=${itemId}`} className='item-button' >
      <div className='position'>
        <img
          src={originalImage}
        alt={`Item ${itemId}`}
        className="item-image"
          title={`${itemId}`}
        onMouseEnter={props.handleMouseEnter}
        />
        <div className={props.hoverClassName} onMouseLeave={props.handleMouseLeave} >
          <p className='items-notes'>{notes}</p>
        </div>
      </div>
    </a>
  );
}
