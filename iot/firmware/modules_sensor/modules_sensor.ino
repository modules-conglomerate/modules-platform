
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <DHT.h>

// ═══════════════════════════════
// НАСТРОЙКИ — МЕНЯЙ ПОД СВОЙ ОБЪЕКТ
// ═══════════════════════════════
const char* WIFI_SSID     = "ИМЯ_WIFI";
const char* WIFI_PASSWORD = "ПАРОЛЬ_WIFI";

const char* MQTT_HOST     = "xxxx.emqx.cloud";
const int   MQTT_PORT     = 1883;
const char* MQTT_USER     = "твой_пользователь";
const char* MQTT_PASSWORD = "твой_пароль";

// ID объекта из Supabase (uuid объекта)
const char* OBJECT_ID = "uuid-объекта-из-supabase";

// Топик: moduli/объект/датчик
const char* TOPIC = "moduli/terrazavod-gibrid/sensors";

// Пин датчика температуры/влажности DHT22
#define DHT_PIN  4
#define DHT_TYPE DHT22

// Интервал отправки данных (секунды)
const int SEND_INTERVAL = 60;
// ═══════════════════════════════

DHT dht(DHT_PIN, DHT_TYPE);
WiFiClient espClient;
PubSubClient mqtt(espClient);

void connectWiFi() {
  Serial.print("Подключение к WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi подключён: " + WiFi.localIP().toString());
}

void connectMQTT() {
  while (!mqtt.connected()) {
    Serial.print("Подключение к MQTT...");
    String clientId = "moduli-" + String(random(0xffff), HEX);
    if (mqtt.connect(clientId.c_str(), MQTT_USER, MQTT_PASSWORD)) {
      Serial.println("OK");
    } else {
      Serial.print("Ошибка: ");
      Serial.println(mqtt.state());
      delay(5000);
    }
  }
}

void sendSensorData() {
  float temperature = dht.readTemperature();
  float humidity    = dht.readHumidity();

  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("Ошибка чтения DHT22");
    return;
  }

  // Формируем JSON
  StaticJsonDocument<256> doc;
  doc["object_id"]   = OBJECT_ID;
  doc["temperature"] = round(temperature * 10) / 10.0;
  doc["humidity"]    = round(humidity * 10) / 10.0;
  doc["timestamp"]   = millis();

  char payload[256];
  serializeJson(doc, payload);

  if (mqtt.publish(TOPIC, payload)) {
    Serial.print("Отправлено: ");
    Serial.println(payload);
  } else {
    Serial.println("Ошибка отправки");
  }
}

void setup() {
  Serial.begin(115200);
  dht.begin();
  connectWiFi();
  mqtt.setServer(MQTT_HOST, MQTT_PORT);
  connectMQTT();
}

void loop() {
  if (!mqtt.connected()) connectMQTT();
  mqtt.loop();

  static unsigned long lastSend = 0;
  if (millis() - lastSend > SEND_INTERVAL * 1000) {
    sendSensorData();
    lastSend = millis();
  }
}
