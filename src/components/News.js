import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";

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

  constructor() {
    super();
    this.state = {
      articles: [],
      loading: false,
      page: 1,
    };
  }

  async componentDidMount() {
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=e400277eec9d4a72ba10fb0a3eec8386&page=1&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({
      articles: parsedData.articles,
      totalArticles: parsedData.totalResults,
      loading: false,
    });
  }

  handleNext = async () => {
    console.log("Next");
    if (
      this.state.page + 1 >
      Math.ceil(this.state.totalArticles / this.props.pageSize)
    ) {
    } else {
      let url = `https://newsapi.org/v2/top-headlines?country=${
        this.props.country
      }&category=${
        this.props.category
      }&apiKey=e400277eec9d4a72ba10fb0a3eec8386&page=${
        this.state.page + 1
      }&pageSize=${this.props.pageSize}`;
      this.setState({ loading: true });
      let data = await fetch(url);
      let parsedData = await data.json();

      this.setState({
        articles: parsedData.articles,
        page: this.state.page + 1,
        loading: false,
      });
    }
  };

  handlePrevious = async () => {
    console.log("Prev");
    let url = `https://newsapi.org/v2/top-headlines?country=${
      this.props.country
    }&category=${
      this.props.category
    }&apiKey=e400277eec9d4a72ba10fb0a3eec8386&page=${
      this.state.page - 1
    }&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    let parsedData = await data.json();

    this.setState({
      articles: parsedData.articles,
      page: this.state.page - 1,
      loading: false,
    });
  };

  render() {
    return (
      <div className="container my-3">
        <h2 className="text-center">NewsMagnet - Top Headlines</h2>
        {this.state.loading && <Spinner />}
        <div className="row">
          {!this.state.loading &&
            this.state.articles.map((news) => {
              return (
                <div className="col-md-4" key={news.url}>
                  <NewsItem
                    title={news.title ? news.title.slice(0, 45) : "News"}
                    description={
                      news.description ? news.description.slice(0, 88) : ""
                    }
                    imageUrl={news.urlToImage ? news.urlToImage : "logo512.png"}
                    newsUrl={news.url ? news.url : ""}
                  />
                </div>
              );
            })}
        </div>
        <div className="container d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-dark"
            onClick={this.handlePrevious}
            disabled={this.state.page <= 1}
          >
            &larr; Previous
          </button>
          <button
            type="button"
            className="btn btn-dark"
            onClick={this.handleNext}
            disabled={
              this.state.page + 1 >
              Math.ceil(this.state.totalArticles / this.props.pageSize)
            }
          >
            Next &rarr;
          </button>
        </div>
      </div>
    );
  }
}

export default News;
