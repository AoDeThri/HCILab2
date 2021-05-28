import { Button, Card, List, Typography, Input, Upload, Form, InputNumber, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import React, { Component, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { connect } from 'umi';
import styles from './style.less';
import { ImgTarget } from '@/target'

const { Option } = Select

class SearchList extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'searchList/getAllTags',
    });
  }
  constructor(props){
    super(props)
    this.state = {
      file: null,
      tag: "all",
    }
  }

  render() {
    const {
      searchList: { imgList, tagList },
      loading,
    } = this.props;
    const content = (
      <div 
        className={styles.pageHeaderContent}
        style={{
          textAlign: "left",
        }}
      >
        <Form
          onFinish = {(v) => handleOnFinish(v)}
          initialValues={{
            number: 9,
          }}
        >
          <Form.Item
            name="file"
            label="Image uploading:"
            rules={[
              {
                required: true,
                message: "Please upload the image."
              }
            ]}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              action={(v) => {
                this.setState({
                  file: v,
                })
              }}
            >
            <PlusOutlined/>
            </Upload>
          </Form.Item>
          <Form.Item
            name="number"
            label="Number of result:"
            rules={[
              {
                required: true,
                message: "Please enter the number of result."
              }
            ]}
          >
            <InputNumber
              min={1}
              defaultValue={9}
            />
          </Form.Item>
          <Form.Item>
            <Button 
              type = "primary" 
              htmlType="submit"
              style={{
                left:"128px"
              }}
            >
              Search
            </Button>
          </Form.Item>
        </Form>

      </div>
    );

    const handleOnFinish = (value) =>{
      const { dispatch } = this.props;
      const { file } = this.state
      const payload = new FormData()
      payload.append('file', file)
      payload.append('number', value.number)
      dispatch({
        type: 'searchList/uploadFile',
        headers: {
          'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>',
        },
        payload,
      })
    }

    const handleAddToWishlist = (name) => {
      const { dispatch } = this.props
      const payload = new FormData()
      payload.append('file', name)
      dispatch({
        type: 'searchList/addToWishList',
        payload,
      })
    }

    const extraContent = (
      <Form>
        <Form.Item
          label="选择图片类型"
        >
          <Select
            style={{ 
              width: 120,
              textAlign: "center", 
            }}
            defaultValue="all"
            onChange={(value) => this.setState({
              tag: value,
            })}
          >
            <Option value="all"> all </Option>
            {tagList.map((i) => (
              <Option value={i}> {i} </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    )

    return (
      <PageContainer content={content} extraContent={extraContent}>
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{
              gutter: 5,
              xs: 5,
              sm: 5,
              md: 5,
              lg: 5,
              xl: 5,
              xxl: 5,
            }}
            dataSource={imgList.filter((item) => {
              const { tag } = this.state
              const imgTag = item.tag
              return tag === "all" || imgTag.find((i) => i === tag) !== undefined
            })}
            renderItem={(item) => {
              if (item.name) {
                return (
                  <List.Item 
                    key={item.name}
                  >
                    <Card
                      hoverable
                      className={styles.card}
                      actions={[
                        <Button 
                          type="primary"
                          disabled={item.inWishlist}
                          onClick={() => handleAddToWishlist(item.name)}
                        >
                          {item.inWishlist ? "已在收藏夹中":"加入收藏夹"}
                        </Button>
                      ]}
                      cover={
                        <img
                          src={ImgTarget + item.name}
                        />
                      }
                    >
                      <Card.Meta
                        title={<a>{item.name}</a>}
                        description={
                          <div></div>
                        }
                      />
                    </Card>
                  </List.Item>
                );
              }
            }}
          />
        </div>
      </PageContainer>
    );
  }
}

export default connect(({ searchList, loading }) => ({
  searchList,
  loading: loading.models.searchList,
}))(SearchList);
