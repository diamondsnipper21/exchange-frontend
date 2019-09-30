/* ============
 * AWS MQTT
 * ============
 *
 * AWS MQTT for sockets
 */

import AWS from 'aws-sdk/global';
import AWSMqtt from 'aws-mqtt';
import _Vue from 'vue';

const sockets = {
  install(Vue) {
    let topics = [];
    let activeTopics = [];
    const callbacks = {};
    const processActiveTopic = (topic, client) => {
      const pos = activeTopics.map(e => e.group).indexOf(topic.group);
      if (pos === -1) {
        activeTopics.push(topic);
      } else {
        client.unsubscribe(activeTopics[pos].name);
        activeTopics[pos] = topic;
      }
    };
    Vue.prototype.$sockets = {
      connected: false,
      client: null,
      init() {
        const config = {
          region: process.env.AWS_REGION,
          accessKeyId: process.env.AWS_ID,
          secretAccessKey: process.env.AWS_SECRET,
        };
        const awsConfig = new AWS.Config(config);
        const client = AWSMqtt.connect({
          WebSocket: window.WebSocket,
          region: awsConfig.region,
          credentials: awsConfig.credentials,
          endpoint: process.env.AWS_ENDPOINT,
          clientId: `mqtt-client-${(Math.floor((Math.random() * 100000) + 1))}`,
          resubscribe: false,
        });

        Vue.prototype.$sockets.client = client;
        client.options.resubscribe = false;

        client.on('connect', () => {
          Vue.prototype.$sockets.connected = true;
          topics.forEach((topic) => {
            processActiveTopic(topic, client);
            client.subscribe(topic.name);
          });
          topics = [];
        });
        client.on('message', (topic, message) => {
          const json = JSON.parse(message);
          const pos = activeTopics.map(e => e.name).indexOf(topic);
          if (pos > -1) {
            const group = activeTopics[pos].group;
            if (group in callbacks) {
              callbacks[group].forEach((callback) => {
                callback(json);
              });
            }
          }
        });
        client.on('close', () => {
          Vue.prototype.$sockets.connected = false;
          activeTopics = [];
        });
        client.on('offline', () => {
          Vue.prototype.$sockets.connected = false;
          activeTopics = [];
        });
      },
      onMessage(group, func) {
        callbacks[group] = callbacks[group] || [];
        let found = false;
        callbacks[group].forEach((callback) => {
          if (callback.toString() === func.toString()) {
            found = true;
          }
        });
        if (!found) {
          callbacks[group].push(func);
        }
      },
      subscribe(topic, group) {
        group = group === undefined ? topic : group;
        if (Vue.prototype.$sockets.connected) {
          processActiveTopic({ name: topic, group }, Vue.prototype.$sockets.client);
          Vue.prototype.$sockets.client.subscribe(topic);
        } else {
          topics.push({ name: topic, group });
        }
      },
      unsubscribeAll(notPrivate) {
        notPrivate = notPrivate === undefined ? true : notPrivate;
        activeTopics.forEach((topic, index) => {
          if (notPrivate && topic.name.startsWith('/user-')) {
            return;
          }
          Vue.prototype.$sockets.client.unsubscribe(topic.name);
          activeTopics.splice(index, 1);
        });
      },
    };
  },
};

_Vue.use(sockets);
