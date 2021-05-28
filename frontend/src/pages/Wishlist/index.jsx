import { Button, Card, List } from 'antd';
import React, { Component } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { connect } from 'umi';
import styles from './style.less';
import { ImgTarget } from "@/target"

class Wishlist extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'wishlist/fetch',
    });
  }

  render() {
    const {
      wishlist: { list },
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

    return (
      <PageContainer content={content}>
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
              if(item){
                return(
                    <List.Item
                      key={item}
                    >
                      <Card
                        hoverable
                        className={styles.card}
                        cover = {
                          <img
                            src={ImgTarget + item}
                          />
                        }
                        actions={[
                          <Button
                            onClick={() => handleDelImg(item)}
                          >从愿望单中删除</Button>
                        ]}
                      >
                        <Card.Meta
                          title={item}
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

export default connect(({ wishlist, loading }) => ({
  wishlist,
  loading: loading.models.wishlist,
}))(Wishlist);
