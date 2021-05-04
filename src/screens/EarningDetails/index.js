import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import { Card, Text, Spinner, Layout } from '@ui-kitten/components';
import moment from 'moment';

import { Constants } from '../../utils/Constants';
import { Help } from '../../utils/Help';
import apiClient from '../../services/apiClient';

const chunk = 10;

function EarningDetailsScreen({ route }) {
    const [earningData, setEarningData] = useState([]);
    const [totalEarning, setTotalEarning] = useState(0);
    const [slice, setSlice] = useState(0);
    const [endReached, setEndReached] = useState(false);

    useEffect(() => {
        getEarnings();
    }, []);
    const getEarnings = () => {
        apiClient.getRequest(`earnings/placepod/${route.params.placepod_id}/${slice}/${chunk}`).then(res => {
            if (res && res.data.length) {
                setTotalEarning(res.totalearnings / 1e+18);
                setSlice(slice + 1);
                setEarningData([...earningData, ...res.data]);
            }
            else if (res && !res.data.length) {
                setEndReached(false);
            }
        }).catch();
    }
    const onEndReached = () => {
        if (!endReached) {
            getEarnings();
        }
    }
    const headerContent = () => (
        <View style={styles.listHeaderContainer}>
            <Image style={styles.image}
                source={{ uri: "data:image/jpeg;base64,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" }} />
            <View>
                <Text category="s2">{route.params.name}</Text>
                <View style={{ flex: 1 }} />
                <Text category="c1">Total Earnings</Text>
                <View style={styles.totalText}>
                    <Text category="s2" style={{ color: Constants.colors.white }}>{totalEarning} NIT</Text>
                </View>
            </View>
        </View>
    )
    return (
        <View style={styles.container}>
            <FlatList data={earningData} keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={headerContent}
                ListEmptyComponent={() => <View style={{alignSelf:'center'}}><Spinner /></View>}
                onEndReached={onEndReached}
                renderItem={({ item }) => (
                    <Card style={styles.cardContent} disabled>
                        <Layout>
                            {
                                Object.keys(item).map((key, index) => (
                                    <Layout style={styles.detailGroup} key={index.toString()}>
                                        <Text category="s2">{key.replace('_', ' ').toUpperCase()}</Text>
                                        {key.includes('time') ? <Text category="s1">{moment(item[key]).format("MMMM DD,YYYY,   HH:mm:ss")}</Text>
                                            : <Text category="s1">{item[key].toString()}</Text>}
                                    </Layout>
                                ))
                            }
                        </Layout>
                    </Card>
                )}
            />
        </View>
    )
}
export default EarningDetailsScreen;
const styles = StyleSheet.create({
    container: {
        paddingTop: Constants.screenSize.height * 0.14
    },
    listHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 30
    },
    totalText: {
        backgroundColor: Constants.colors.primary, padding: 5, borderRadius: 5, alignItems: 'center'
    },
    image: { height: 100, width: 100, resizeMode: 'cover', borderRadius: 10 },
    cardContent: {
        margin: 10
    },
    detailGroup: {
        marginVertical: 10,
    }
});