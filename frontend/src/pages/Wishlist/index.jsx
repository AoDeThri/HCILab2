import { Button, Card, List, Select, Form } from 'antd';
import React, { Component } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { connect } from 'umi';
import styles from './style.less';
import { ImgTarget } from "@/target"

const { Option } = Select

class Wishlist extends Component {
  constructor(props){
    super(props)
    this.state = {
      tag: "all",
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'wishlist/fetch',
    });
  }

  render() {
    const {
      wishlist: { list },
      searchList: { tagList },
      loading,
    } = this.props;
    const content = (
      <div>在此处查看收藏夹</div>
    );

    const handleDelImg = (item) => {
      const { dispatch } = this.props;
      const payload = {
        file: item,
      }
      dispatch({
        type: 'wishlist/delImg',
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
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 3,
              xl: 4,
              xxl: 4,
            }}
            dataSource={list}
            renderItem={(item) => {
              const { tag } = this.state
              const imgTag = item.tag
              const hidden = !(tag === "all" || imgTag.find((i) => i === tag) !== undefined)
              console.log(hidden)
              if(item.file){
                return(
                    <List.Item
                      key={item.file}
                      hidden={hidden}
                    >
                      <Card
                        hoverable
                        className={styles.card}
                        cover = {
                          <img
                            src={ImgTarget + item.file}
                          />
                        }
                        actions={[
                          <Button
                            onClick={() => handleDelImg(item.file)}
                          >从收藏夹中删除</Button>
                        ]}
                      >
                        <Card.Meta
                          title={item.file}
                        />
                      </Card>
                    </List.Item>
                  )
              }
            }}
          />
        </div>
      </PageContainer>
    );
  }
}

export default connect(({ wishlist, loading, searchList }) => ({
  wishlist,
  searchList,
  loading: loading.models.wishlist,
}))(Wishlist);
