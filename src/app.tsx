import React from 'react';
import {SafeAreaView, ScrollView, StatusBar, Text, View} from 'react-native';
import styled from 'styled-components';

export const App: React.FC = () => {
  return (
    <SafeAreaWrapper>
      <StatusBar barStyle={'dark-content'} />
      <ScrollView style={{height: '100%'}} contentInsetAdjustmentBehavior="automatic">
        <MainView>
          <Title>Hello World!</Title>
        </MainView>
      </ScrollView>
    </SafeAreaWrapper>
  );
};
App.displayName = 'App';

const SafeAreaWrapper = styled(SafeAreaView)`
  background-color: #22223b;
`;

const MainView = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
`;

const Title = styled(Text)`
  color: #c9ada7;
  font-size: 32px;
`;
