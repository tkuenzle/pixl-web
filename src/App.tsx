import { MuiThemeProvider } from '@material-ui/core';
import * as React from 'react';

import {
  AddItem,
  Fab,
  ImageItem,
  ImageItemValues,
  MainContainer,
  Pixelate,
  TitleBar,
} from './components';
import theme from './theme';

interface AppState {
  items: ImageItemValues[];
  editing: number | undefined | 'new';
}

const newImageItem: Partial<ImageItemValues> = {
  minNumberOfPixels: 4,
};

class App extends React.Component<{}, AppState> {
  public state: AppState = {
    editing: 'new',
    items: [],
  };

  private pixelate = React.createRef<Pixelate>();

  public handleSave(index: number | 'new') {
    const { editing } = this.state;
    if (typeof index === 'number') {
      return (values: ImageItemValues) => {
        if (editing === index) {
          this.setItemState(editing, values);
          this.setState({ editing: undefined });
        }
      };
    }
    return (values: ImageItemValues) => {
      const { items } = this.state;
      items.push(values);
      this.setState({ items, editing: undefined });
    };
  }

  public handleCancel = () => {
    this.setState({ editing: undefined });
  }

  public handleEdit(index: number) {
    return () => this.setState({ editing: index });
  }

  public setItemState(index: number, item: ImageItemValues) {
    const { items } = this.state;
    const newItems = items.slice();
    (newItems[index] = item), this.setState({ items: newItems });
  }

  public addItem = () => {
    const { editing } = this.state;
    if (editing == null) {
      this.setState({ editing: 'new' });
    }
  }

  public run = async () => {
    const { items } = this.state;
    const { current } = this.pixelate;
    if (!current) {
      return;
    }
    for (const item of items) {
      await current.pixelate(item);
    }
    await current.download();
  }

  public renderButton() {
    const { editing } = this.state;
    if (editing == null) {
      return <AddItem onClick={this.addItem} />;
    }
    return null;
  }

  public render() {
    const { items, editing } = this.state;
    const forbiddenNames = items.filter((_, index) => index !== editing).map(item => item.title);
    const mappedItems = items.map((item, index) => (
      <ImageItem
        initialValues={item}
        key={`${index}`}
        onCancel={this.handleCancel}
        onSave={this.handleSave(index)}
        onEdit={this.handleEdit(index)}
        editing={index === editing}
        {...{ forbiddenNames }}
      />
    ));

    const newItem = editing === 'new' && (
      <ImageItem
        initialValues={newImageItem}
        key="new"
        onCancel={this.handleCancel}
        onSave={this.handleSave('new')}
        onEdit={this.handleEdit(0)}
        editing={true}
        {...{ forbiddenNames }}
      />
    );

    const fabButton = editing === undefined && <Fab onClick={this.run} />;

    return (
      <MuiThemeProvider theme={theme}>
        <div>
          <TitleBar title="pixl" />;
          <MainContainer>
            {mappedItems}
            {newItem}
            {this.renderButton()}
          </MainContainer>
          {fabButton}
          <Pixelate ref={this.pixelate} />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
