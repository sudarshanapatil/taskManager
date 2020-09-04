import React from 'react';
import { ProgressBar, Button, InputGroup, FormControl } from 'react-bootstrap';

import '../styles/Home.css'
const taskLength = 20;

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      totalServer: 1,
      deleteServer: 0,
      runningTasks: [],
      waitingTasks: 0,
      timerRunning: false,
      taskToBeadded: 0
    }
  }

  addServer = () => {
    let { totalServer, runningTasks, waitingTasks } = this.state;
    this.setState({
      totalServer: totalServer + 1,
      runningTasks: waitingTasks ? [...runningTasks, taskLength] : runningTasks
    });
  }

  deleteTask = () => {
    this.setState({ waitingTasks: this.state.waitingTasks - 1 });
  }

  removeServer = () => {
    if (this.state.totalServer > 1) {
      if (this.state.runningTasks.length < this.state.totalServer) {
        this.setState({ totalServer: this.state.totalServer - 1 });
      }
      else {
        this.setState({ deleteServer: this.state.deleteServer + 1 })
      }
    }
  }

  setTask = (e) => {
    this.setState({ taskToBeadded: parseInt(e.target.value) })
  }

  scheduleTask = () => {
    if (this.state.runningTasks.length < this.state.totalServer) {
      this.startNewTask();
    } else {
      this.setState({ waitingTasks: this.state.waitingTasks + 1 });
    }
  }

  allTasks = () => {
    let count = 0;
    while (count < this.state.taskToBeadded) {
      this.scheduleTask();
      count++;
    }
  }

  startNewTask = () => {
    if (this.state.timerRunning) {
      this.setState({ runningTasks: [...this.state.runningTasks, taskLength] });
    } else {
      this.setState({ timerRunning: true });
      const interval = setInterval(() => {
        let { runningTasks, totalServer, deleteServer, waitingTasks } = this.state;
        if (runningTasks.length === 0) {
          this.setState({
            runningTasks: [...runningTasks, taskLength]
          });

        } else {
          const newRunning = runningTasks.map(remainingTime => remainingTime - 1)
            .filter(remainingTime => remainingTime !== 0);
          if (newRunning.length !== runningTasks.length) {
            let maxServerToBeDeleted = Math.min(deleteServer, totalServer - newRunning.length);
            this.setState({
              totalServer: totalServer - maxServerToBeDeleted,
              deleteServer: deleteServer - maxServerToBeDeleted
            });
            if (waitingTasks > 0 && totalServer > newRunning.length) {
              const maxTaskToBeStarted = Math.min(waitingTasks, totalServer - newRunning.length);
              newRunning.push(Array(maxTaskToBeStarted).fill(0).map(() => taskLength));
              this.setState({ runningTasks: newRunning });
              this.setState({ waitingTasks: waitingTasks - maxTaskToBeStarted });
            } else if (newRunning.length === 0) {
              clearInterval(interval);
              this.setState({ timerRunning: false, runningTasks: [] });
            }
          }
          this.setState({ runningTasks: newRunning });
        }
      }, 1000);
    }
  }
  render() {
    return (
      <div>
        <div className='title' >
          Task Manager
        </div>
        <div className='wrapperDiv'>
          <div className='serverButtons'>
            <Button style={{ marginRight: 10 }} onClick={() => this.addServer()}>
              Add Server
          </Button>
            <Button onClick={() => this.removeServer()}>
              Remove Server
          </Button>
          </div>
          <div className='addTask'>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="tasks"
                aria-describedby="basic-addon2"
                onChange={(e) => this.setTask(e)}
              />
              <InputGroup.Append>
                <Button variant="outline-secondary" onClick={() => this.allTasks()}>Add Task</Button>
              </InputGroup.Append>
            </InputGroup>
          </div>
          <div>
          </div>
          <div className='taskWrapper'>
            <p>Total server available : {this.state.totalServer}</p>
            Running tasks:
            {this.state.runningTasks.map((remaining => (
              <div>
                <ProgressBar style={{ margin: 10 }} label={`00:${remaining}`} now={100 - (remaining / taskLength) * 100} />
              </div>
            )))}
            {(this.state.waitingTasks) &&
              <div>
                Waiting tasks:
                {Array(this.state.waitingTasks).fill(this.state.waitingTasks).map(() => (
                  <div className='waitingTasks' >
                    <div className='waitingkkTasks'>
                    </div>
                    <span className="close" onClick={() => this.deleteTask()}>
                    </span>
                  </div>
                ))}
              </div>}
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
