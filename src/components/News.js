import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import InfiniteScroll from "react-infinite-scroll-component";

import PropTypes from "prop-types";

export class News extends Component {
  static defaultProps = {
    pageSize: 9,
    country: "us",
    category: "general",
  };

  static propTypes = {
    pageSize: PropTypes.number,
    country: PropTypes.string,
    category: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalArticles: 0,
    };

    document.title =
      this.capilatizeFirstLetter(this.props.category) + " - NewsMagnet";
  }

  capilatizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  async componentDidMount() {
    this.props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    this.props.setProgress(30);
    let parsedData = await data.json();
    this.props.setProgress(70);
    this.setState({
      articles: parsedData.articles,
      totalArticles: parsedData.totalResults,
      loading: false,
    });
    this.props.setProgress(100);
  }

  fetchMoreData = async () => {
    this.props.setProgress(0);
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
    this.setState({ page: this.state.page + 1 });
    this.setState({ loading: true });
    let data = await fetch(url);
    this.props.setProgress(30);
    let parsedData = await data.json();
    this.props.setProgress(70);
    this.setState({
      articles: this.state.articles.concat(parsedData.articles),
      totalArticles: parsedData.totalResults,
      loading: false,
    });
    this.props.setProgress(100);
  };

  render() {
    return (
      <>
        <h1
          className="text-center fw-bold"
          style={{
            margin: "35px 0px",
            marginTop: "90px",
          }}
        >
          NewsMagnet - Top {this.capilatizeFirstLetter(this.props.category)}{" "}
          Headlines
        </h1>
        {this.state.loading && <Spinner />}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalArticles}
          loader={<Spinner />}
        >
          <div className="container">
            <div className="row">
              {this.state.articles.map((news) => {
                return (
                  <div className="col-md-4" key={news.url}>
                    <NewsItem
                      title={news.title ? news.title.slice(0, 45) : "News"}
                      description={
                        news.description ? news.description.slice(0, 88) : ""
                      }
                      imageUrl={
                        news.urlToImage ? news.urlToImage : "logo512.png"
                      }
                      newsUrl={news.url ? news.url : ""}
                      date={news.publishedAt}
                      author={news.author}
                      source={news.source.name}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </InfiniteScroll>
      </>
    );
  }
}

export default News;
