import throttle from 'lodash/throttle';
import * as React from 'react';

import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  MuiThemeProvider,
} from '@material-ui/core';

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
  progress: number;
  running: boolean;
}

const newImageItem: Partial<ImageItemValues> = {
  minNumberOfPixelsX: 4,
  minNumberOfPixelsY: 4,
  numberOfImages: 5,
};

class App extends React.Component<{}, AppState> {
  public state: AppState = {
    editing: 'new',
    items: [],
    progress: 0,
    running: false,
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

    const numberOfImages = items.reduce((acc, i) => {
      const img = i.image.file;
      const { crop } = i.image;
      const numberOfPixelsY = i.minNumberOfPixelsY;
      const height =
        crop && crop.height ? Math.floor((img.height * crop.height) / 100) : img.height;
      const images = Math.min(
        Math.ceil(Math.log(height / numberOfPixelsY) / Math.log(2)),
        i.numberOfImages,
      );
      const total = acc + images;
      return total;
    }, 0);
    const step = 100 / numberOfImages;

    const updateState = throttle(progress => this.setState({ progress }), 1000, {
      leading: true,
      trailing: false,
    });
    const counter = { clicks: 0 };
    const increase = () => {
      counter.clicks = counter.clicks + 1;
      updateState(counter.clicks * step);
    };

    this.setState({ running: true, progress: 0 });
    for (const item of items) {
      await current.pixelate(item, increase);
    }
    this.setState({ running: false });
    await current.download();
  }

  public renderButton() {
    const { editing } = this.state;
    if (editing == null) {
      return <AddItem onClick={this.addItem} />;
    }
    return null;
  }

  public renderDialog() {
    const { progress, running } = this.state;
    return (
      <Dialog open={running} fullWidth={true}>
        <LinearProgress variant="determinate" value={progress} />
        <DialogTitle>Just hang on a little</DialogTitle>
        <DialogContent>
          <DialogContentText>Your images are being prepared...</DialogContentText>
        </DialogContent>
      </Dialog>
    );
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
        initialValues={{ ...newImageItem, title: `Image ${items.length + 1}` }}
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
          <TitleBar title="Pixelate your images" />;
          <MainContainer>
            {mappedItems}
            {newItem}
            {this.renderButton()}
          </MainContainer>
          {fabButton}
          <Pixelate ref={this.pixelate} />
        </div>
        {this.renderDialog()}
      </MuiThemeProvider>
    );
  }
}

export default App;
