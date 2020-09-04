import React from 'react';
import { ProgressBar, InputGroup, FormControl } from 'react-bootstrap';

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
      taskToBeAdded: 1
    }
  }

  addServer = () => {
    let { totalServer, runningTasks, waitingTasks } = this.state;
    console.log(totalServer, runningTasks, waitingTasks)
    this.setState({
      totalServer: totalServer + 1,
      runningTasks: waitingTasks ? [...runningTasks, taskLength] : runningTasks,
      waitingTasks: waitingTasks ? waitingTasks - 1 : waitingTasks
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
    if (parseInt(e.target.value) > 0)
      this.setState({ taskToBeAdded: parseInt(e.target.value) })
  }

  scheduleTask = () => {
    let { runningTasks, totalServer, waitingTasks, taskToBeAdded } = this.state;
    const toBeScheduled = Math.min(taskToBeAdded, totalServer - runningTasks.length);
    if (runningTasks.length < totalServer) {
      this.startNewTask(toBeScheduled);
      waitingTasks = waitingTasks - toBeScheduled;
    }
    if (waitingTasks + taskToBeAdded <= 0)
      waitingTasks = 0;
    else
      waitingTasks = waitingTasks + taskToBeAdded;

    this.setState({ waitingTasks: waitingTasks });

  }

  startNewTask = (n) => {
    this.setState({ runningTasks: [...this.state.runningTasks, ...Array(n).fill(taskLength)] });
    if (!this.state.timerRunning) {
      this.setState({ timerRunning: true });
      const interval = setInterval(() => {
        let { runningTasks, totalServer, deleteServer, waitingTasks } = this.state;
        const newRunning = runningTasks.map(remainingTime => remainingTime - 1)
          .filter(remainingTime => remainingTime !== 0);
        if (newRunning.length !== runningTasks.length) {
          let maxServerToBeDeleted = Math.min(deleteServer, totalServer - newRunning.length);
          totalServer = totalServer - maxServerToBeDeleted;
          deleteServer = deleteServer - maxServerToBeDeleted;

          this.setState({
            totalServer,
            deleteServer
          });
          if (waitingTasks > 0 && totalServer > newRunning.length) {
            const maxTaskToBeStarted = Math.min(waitingTasks, totalServer - newRunning.length);
            newRunning.push(...Array(maxTaskToBeStarted).fill(taskLength));
            this.setState({ runningTasks: newRunning });
            this.setState({ waitingTasks: waitingTasks - maxTaskToBeStarted });
          } else if (newRunning.length === 0) {
            clearInterval(interval);
            this.setState({ timerRunning: false, runningTasks: [] });
          }
        }
        this.setState({ runningTasks: newRunning });
      }, 1000);
    }
  }

  render() {
    const { totalServer, deleteServer } = this.state;
    return (
      <div>
        <div className='title' >
          Task Manager
        </div>
        <div className='wrapper-div'>
          <div className='server-buttons'>
            <button className='add-server' onClick={() => this.addServer()}>
              Add Server
            </button>
            <button className='remove-server' onClick={() => this.removeServer()} disabled={(totalServer - deleteServer) <= 1}>
              Remove Server
            </button>
            <div className='server-info'>
              Total Server
              <p>{this.state.totalServer}</p>
            </div>
            <div className='server-info'>
              Server To Be Deleted
               <p>{this.state.deleteServer}</p>
            </div>
          </div>
          <div className='add-task'>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="tasks"
                aria-describedby="basic-addon2"
                type="number"
                value={this.state.taskToBeAdded}
                onChange={(e) => this.setTask(e)}
              />
              <InputGroup.Append>
                <button className='task-input' onClick={() => this.scheduleTask()}>Add Task</button>
              </InputGroup.Append>
            </InputGroup>
          </div>
          <div>
          </div>
          <div className='task-wrapper'>
            {(this.state.runningTasks.length > 0) && <div>
              {this.state.runningTasks.map((remaining => (
                <div>
                  <ProgressBar
                    style={{
                      margin: 10, backgroundColor: 'white', borderStyle: 'solid',
                      height: 40, borderColor: 'rgb(147, 112, 219)', borderWidth: 4
                    }}
                    label={`00:${remaining}`} now={100 - (remaining / taskLength) * 100} />
                </div>
              )))}
            </div>
            }
            {(this.state.waitingTasks > 0) &&
              <div>
                {Array(this.state.waitingTasks).fill(this.state.waitingTasks).map(() => (
                  <div className='waiting-task row'>
                    <div sm={3} className='col-sm-11'>
                      <ProgressBar style={{
                        margin: 10, backgroundColor: 'white', borderStyle: 'solid',
                        height: 40, borderColor: 'rgb(147, 112, 219)', borderWidth: 4
                      }}
                        now={0}></ProgressBar>
                    </div>
                    <div className='col-sm-1'>
                      <span className="close" onClick={() => this.deleteTask()}>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Home;