import React from 'react';

export default class Items extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      showNotes: false
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
      showNotes: true
    });
  }

  handleMouseLeave() {
    this.setState({
      showNotes: false
    });
  }

  render() {
    const hoverClassName = this.state.showNotes ? 'shadow-wrapper' : 'shadow-wrapper hidden';
    return (
      <div className='items-container'>
        <p className='items'>{this.props.content}</p>

        <div className='item-list-wrapper'>
          {
            this.state.items.map(item => (
              <div key={item.itemId} className="item-wrapper">
                <Item
                  item={item}
                  handleMouseEnter={this.handleMouseEnter}
                  handleMouseLeave={this.handleMouseLeave}
                  hoverClassName={hoverClassName}/>
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

function Item(props) {
  const { originalImage, notes, itemId } = props.item;

  return (
    <a href={`#items?itemId=${itemId}`} className='item-button' >
      <div className='position'>
        <img
        src={originalImage}
        alt={`Item ${itemId}`}
        className="item-image"
        onMouseEnter={props.handleMouseEnter}
        />
        <div className={props.hoverClassName} onMouseLeave={props.handleMouseLeave} >
          <p className='items-notes'>{notes}</p>
        </div>
      </div>
    </a>
  );
}
