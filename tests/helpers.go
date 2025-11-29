package core

import (
	"fmt"
	"io/ioutil"
	"os"
	"strings"
)

func ReadFile(path string) ([]byte, error) {
	data, err := ioutil.ReadFile(path)
	if err != nil {
		return nil, err
	}
	return data, nil
}

func ReadFileLines(path string) ([]string, error) {
	data, err := ioutil.ReadFile(path)
	if err != nil {
		return nil, err
	}
	return strings.Split(string(data), "\n"), nil
}

func ReadFileLinesWithIndex(path string) ([]int, error) {
	data, err := ioutil.ReadFile(path)
	if err != nil {
		return nil, err
	}
	return strings.Split(string(data), "\n"), nil
}

func ReadFileLinesWithIndexAndIndex(path string) ([]int, int, error) {
	data, err := ioutil.ReadFile(path)
	if err != nil {
		return nil, 0, err
	}
	return strings.Split(string(data), "\n"), 0, nil
}