/**
 * inpired by codepen: [Fabric DetailsList](https://codepen.io/anon/pen/KrpqQN)
 */

import { 
  Image, 
  ImageFit, 
  Link, 
  Selection, 
  Spinner, 
  MarqueeSelection, 
  DetailsList, 
  IColumn, 
  IDetailsListStyles, 
  IButtonStyles 
} from '@fluentui/react';

import * as React from 'react';

 
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

const refreshButtonStyles:IButtonStyles = {
  root: {
    verticalAlign: 'middle'
  }
};

export interface InfiniteDetailListFetchProps {
  name?: string;
  height: number;
}

interface InfiniteDetailListFetchState {
  rows: any
  isLoading: Boolean
  subreddit: string
  nextPageToken: any,
  height: number

}

type FetchData = any

export class InfiniteDetailListFetchControl extends React.Component<InfiniteDetailListFetchProps, InfiniteDetailListFetchState> {
  private _selection;
  

  constructor(props: InfiniteDetailListFetchProps) {
    super(props);

    this._selection = new Selection();
    this.state = {
      rows: null,
      isLoading: false,
      subreddit: SUBREDDIT,
      nextPageToken: null,
      height: props.height
    };

    this._onReloadClick = this._onReloadClick.bind(this);


  }

  public componentDidMount() {
    this._onReloadClick();
  }

  public componentDidUpdate(prevProps: Readonly<InfiniteDetailListFetchProps>, prevState: Readonly<InfiniteDetailListFetchState>, snapshot?: any): void {
      console.log( 'componentDidUpdate',  prevState.height, prevProps.height, this.props.height)
      
      if( prevState.height !=  this.props.height ) {
        this.setState( { ...prevState, height: this.props.height})
      }
  }
  


  public render() {
    let { rows, subreddit, isLoading } = this.state;

    return (

      <div>
{/* 
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
*/}
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
              styles={ this._getStyles() }
              
            />
            {isLoading && (
              <Spinner className='loadingSpinner' label='Loading...' ariaLive="assertive" labelPosition="left" />
            )}

          </MarqueeSelection>
          
        )}
     </div>

    );
  }

  /**
   * 
   * styles got from  [DetailsList Fixed Header without ScrollablePane](https://developer.microsoft.com/en-us/fluentui#/controls/web/scrollablepane)
   * 
   * @returns 
   */
  private _getStyles() : Partial<IDetailsListStyles> {

    const spinner_height = 50
    const h = `${this.state.height - spinner_height}px`

    return {
        root: {
            overflowX: 'scroll',
            selectors: {
                '& [role=grid]': {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'start',
                  height: h,
                },
            }
        },
        headerWrapper: {
          flex: '0 0 auto',
        },
        contentWrapper: {
          flex: '1 1 auto',
          overflowY: 'auto',
          overflowX: 'hidden',
        },
    }
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
          isLoading: false,
          height: this.props.height
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

