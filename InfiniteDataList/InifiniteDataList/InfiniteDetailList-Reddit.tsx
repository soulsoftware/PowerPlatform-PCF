/**
 * inpired by codepen: [Fabric DetailsList](https://codepen.io/anon/pen/KrpqQN)
 */

import { Image, ImageFit, Link, Selection, css, FontClassNames, IconButton, Spinner, MarqueeSelection, DetailsList, IColumn, ScrollablePane, ScrollbarVisibility, DetailsListLayoutMode, IDetailsListStyles } from '@fluentui/react';
import * as React from 'react';
// import ReactDOM = require('react-dom');

//
// [DetailsList Fixed Header without ScrollablePane](https://developer.microsoft.com/en-us/fluentui#/controls/web/scrollablepane)
//
const gridStyles: Partial<IDetailsListStyles> = {
    root: {
      overflowX: 'scroll',
      selectors: {
        '& [role=grid]': {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          height: '600px',
        },
      },
    },
    headerWrapper: {
      flex: '0 0 auto',
    },
    contentWrapper: {
      flex: '1 1 auto',
      overflowY: 'auto',
      overflowX: 'hidden',
    },
  };
  
const SUBREDDIT = 'bostonterriers';
const THUMBSIZE = 80;

const columns: IColumn[] = [
  {
    key: 'score',
    name: 'Score',
    fieldName: 'score',
    minWidth: 40,
    maxWidth: 40,
    isResizable: true
  },
  {
    key: 'thumb',
    name: 'Thumb',
    fieldName: 'thumb',
    minWidth: THUMBSIZE,
    maxWidth: THUMBSIZE,
    onRender: (item: any) => (
      <Image
        className='thumb'
        imageFit={ImageFit.cover}
        src={item.thumb}
        width={THUMBSIZE}
        height={THUMBSIZE}
      />)
  },
  {
    key: 'article',
    name: 'Post',
    minWidth: 100,
    maxWidth: 180,
    isResizable: true,
    onRender: (item: any) => (
      <div style={{ whiteSpace: 'normal' }}>
        <Link className='ms-font-xl' href={item.url} target='_blank'>{item.title}</Link>
        <div className='itemMetadata'>
          <span>By {item.author}</span>
          <span><i className='ms-Icon ms-Icon--Chat' /> {item.comments} comment{item.comments === 1 ? '' : 's'}</span>
        </div>
      </div>
    )
  }
];

const refreshButtonStyles = {
  root: {
    verticalAlign: 'middle'
  }
};

export interface InfiniteDetailListRedditProps {
  name?: string;
}

interface InfiniteDetailListRedditState {
  rows: any
  isLoading: Boolean
  subreddit: string
  nextPageToken: any

}

type FetchData = any

export class InfiniteDetailListRedditControl extends React.Component<InfiniteDetailListRedditProps, InfiniteDetailListRedditState> {
  private _selection;

  constructor(props: InfiniteDetailListRedditProps) {
    super(props);

    this._selection = new Selection();
    this.state = {
      rows: null,
      isLoading: false,
      subreddit: SUBREDDIT,
      nextPageToken: null
    };
    this._onReloadClick = this._onReloadClick.bind(this);
  }

  public componentDidMount() {
    this._onReloadClick();
  }

  public render() {
    let { rows, subreddit, isLoading } = this.state;

    return (

      <div>
        <div className={css(FontClassNames.xxLarge, 'titleArea')}>
          <span className='title'>reddit/r/<Link className='reddit'>{subreddit}</Link></span>
          {!isLoading ? (
            <IconButton
              styles={refreshButtonStyles}
              // className='refresh'
              iconProps={{ iconName: 'Refresh' }}
              onClick={this._onReloadClick}
            />
          ) : (
            <Spinner className='inlineSpinner' />
          )}
        </div>
        {rows && (
          
          <MarqueeSelection selection={this._selection}>
            <DetailsList
              items={rows}
              columns={columns}
              selection={this._selection}
            //   layoutMode={DetailsListLayoutMode.fixedColumns}
              onRenderMissingItem={() => this._onDelayedLoadNextPage()}
              onRenderRow={(props, defaultRender) =>
                <div onClick={() => console.log('clicking: ' + props?.item.title)}>{(defaultRender) ? defaultRender(props) : null}</div>
              }
              styles={gridStyles}
            />
            {isLoading && (
              <Spinner className='loadingSpinner' label='Loading...' />
            )}

          </MarqueeSelection>
          
        )}
     </div>

    );
  }

  private _onReloadClick() {
    this.setState({ rows: null, nextPageToken: null });

    this._onLoadNextPage();
  }

  private _onDelayedLoadNextPage() {
    console.log('onDelayedLoadNextPage getting called')
    let { isLoading } = this.state;

    if (!isLoading) {
      this.setState({ isLoading: true });

      // This setTimeout is only here for illustrating a slow API. Reddit API is pretty fast.
      setTimeout(() => this._onLoadNextPage(), 1000);
    }
  }

  private _onLoadNextPage() {

    const { subreddit, nextPageToken } = this.state;

    const url = `https://www.reddit.com/r/` +
      `${subreddit}.json` +
      `${nextPageToken ? '?limit=5&after=' + nextPageToken : ''}`;

    this.setState({ isLoading: true });

    fetch(url).then(
      response => response.json()).then(json => {

        const rows = this._getRowsFromData(json.data);

        this.setState({
          rows,
          nextPageToken: json.data.after,
          isLoading: false
        });

        this._selection.setItems(rows);
      });
  }

  private _getRowsFromData(response: FetchData) {
    const { rows, nextPageToken } = this.state;

    let items = response.children.map((child: any) => {
      const data = child.data;
      return {
        key: data.id,
        subreddit: data.subreddit,
        title: data.title,
        author: data.author,
        url: data.url,
        score: data.score,
        thumb: data.thumbnail,
        comments: data.num_comments
      };
    });

    if (rows && nextPageToken) {
      items = rows.slice(0, rows.length - 1).concat(items);
    }

    if (response.after) {
      items.push(null);
    }

    return items;
  }
}

// ReactDOM.render( 
//   <InfiniteDetailListReddit />,
//   document.getElementById('content')
// );

