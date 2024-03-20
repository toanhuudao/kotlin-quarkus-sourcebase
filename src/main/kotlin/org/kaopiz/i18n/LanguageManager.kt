@file:Suppress("ktlint:standard:no-wildcard-imports")

package org.kaopiz.i18n

import java.util.*

object LanguageManager {
    private val cache = hashMapOf<String, Properties>()
    private val currentLanguage: ThreadLocal<String> =
        ThreadLocal.withInitial {
            "en"
        }

    fun setLanguage(language: String) {
        currentLanguage.set(language)
    }

    private fun loadProperties(language: String): Properties {
        return cache.getOrPut(language) {
            val properties = Properties()
            val classLoader = Thread.currentThread().contextClassLoader
            classLoader.getResourceAsStream("messages_$language.properties").use { inputStream ->
                if (inputStream != null) {
                    properties.load(inputStream)
                } else {
                    throw IllegalArgumentException(
                        "Language file not found: messages_$language.properties",
                    )
                }
            }
            properties
        }
    }

    fun getMessage(key: String): String {
        val language = currentLanguage.get()
        val properties = loadProperties(language)
        return properties.getProperty(key, key)
    }

    fun hasMessage(key: String): Boolean {
        val language = currentLanguage.get()
        val properties = loadProperties(language)
        return properties.containsKey(key)
    }
}
